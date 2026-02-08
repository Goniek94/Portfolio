import { FileNode } from "./index";

// ============================================
// AUTOSELL.PL - FULL STACK PORTFOLIO
// ============================================
export const autosellFiles: FileNode[] = [
  // ---------------------------------------------------------------------------
  // 1. FRONTEND (React, Context API, Hooks)
  // ---------------------------------------------------------------------------
  {
    name: "FRONTEND",
    language: "typescript",
    isOpen: true,
    children: [
      {
        name: "useListingForm.js",
        language: "javascript",
        content: `import { useState, useCallback } from "react";
import FormValidator from "../utils/FormValidator";

const TEMP_STORAGE_KEY = "auto_sell_temp_form";
const DRAFT_STORAGE_KEY = "auto_sell_draft_form";

const initialFormData = {
  brand: "",
  model: "",
  generation: "",
  version: "",
  productionYear: "",
  vin: "",
  registrationNumber: "",
  condition: "",
  accidentStatus: "",
  damageStatus: "",
  tuning: "Nie",
  imported: "Nie",
  registeredInPL: "Tak",
  firstOwner: "Nie",
  disabledAdapted: "Nie",
  bodyType: "",
  color: "",
  doors: "",
  mileage: "",
  lastOfficialMileage: "",
  countryOfOrigin: "",
  fuelType: "",
  power: "",
  engineSize: "",
  transmission: "",
  drive: "",
  weight: "",
  voivodeship: "",
  city: "",
  images: [],
  mainImage: "",
  description: "",
  price: "",
  rentalPrice: "",
  purchaseOption: "sprzedaz",
  purchaseOptions: "",
  sellerType: "Prywatny",
  headline: "",
  listingType: "standardowe",
  negotiable: "Tak",
  leasingCompany: "",
  remainingInstallments: "",
  installmentAmount: "",
  cessionFee: "",
  exchangeOffer: "",
  exchangeValue: "",
  exchangePayment: "",
  exchangeConditions: "",
};

export default function useListingForm(isReturningFromPreview = false) {
  const loadFormData = () => {
    if (isReturningFromPreview) {
      try {
        const tempData = localStorage.getItem(TEMP_STORAGE_KEY);
        if (tempData) {
          const parsedData = JSON.parse(tempData);
          localStorage.removeItem(TEMP_STORAGE_KEY);
          return { ...parsedData, photos: [] };
        }
      } catch (error) {
        console.error("Błąd ładowania tymczasowych danych:", error);
      }
    }

    if (!isReturningFromPreview) {
      try {
        const draftData = localStorage.getItem(TEMP_STORAGE_KEY);
        if (draftData) {
          const parsedData = JSON.parse(draftData);
          localStorage.removeItem(TEMP_STORAGE_KEY);
          return { ...parsedData, photos: [] };
        }
      } catch (error) {
        console.error("Błąd ładowania wersji roboczej:", error);
      }
    }

    return initialFormData;
  };

  const [formData, setFormData] = useState(loadFormData);
  const [errors, setErrors] = useState({});

  const saveTemporaryData = (data) => {
    try {
      const dataToSave = { ...data };
      if (dataToSave.photos) delete dataToSave.photos;
      
      if (dataToSave.images && Array.isArray(dataToSave.images)) {
        dataToSave.images = dataToSave.images.map((img) => {
          if (typeof img === "string") return img;
          if (img && typeof img === "object") {
            return { url: img.url || img.src || "", name: img.name || "" };
          }
          return img;
        });
      }

      delete dataToSave.file;
      delete dataToSave.files;

      const dataString = JSON.stringify(dataToSave);
      const dataSize = new Blob([dataString]).size;

      if (dataSize > 4 * 1024 * 1024) {
        console.warn("Dane zbyt duże, przycinam...");
        delete dataToSave.mainImage;
        if (dataToSave.images) dataToSave.images = dataToSave.images.slice(0, 5);
      }

      localStorage.setItem(TEMP_STORAGE_KEY, JSON.stringify(dataToSave));
    } catch (error) {
      console.error("Błąd zapisu tymczasowego:", error);
    }
  };

  const handleChange = useCallback((fieldOrEvent, value) => {
    let field, val;
    if (fieldOrEvent && fieldOrEvent.target) {
      field = fieldOrEvent.target.name;
      val = fieldOrEvent.target.value;
    } else {
      field = fieldOrEvent;
      val = value;
    }

    setFormData((prev) => ({ ...prev, [field]: val }));
    setErrors((prev) => {
      if (prev[field]) {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      }
      return prev;
    });
  }, []);

  const validateForm = () => {
    const newErrors = FormValidator.validateForm(formData);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return {
    formData,
    setFormData,
    errors,
    setErrors,
    handleChange,
    validateForm,
    saveTemporaryData,
  };
}`,
      },
      {
        name: "AuthContext.js",
        language: "javascript",
        content: `import React, { createContext, useContext, useState, useEffect } from "react";
import { isAuthenticated as checkAuth, refreshUserData, clearAuthData, setAuthData } from "../services/api/config";
import AuthService from "../services/api/authApi";
import { authLogger } from "../utils/logger";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      const hasSessionFlag = localStorage.getItem("isLoggedIn") === "true";
      if (!hasSessionFlag) {
        handleLogoutCleanup();
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      const authenticated = await checkAuth();

      if (authenticated) {
        const freshUserData = await refreshUserData();
        if (freshUserData) {
          setUser(freshUserData);
          setIsAuthenticated(true);
          localStorage.setItem("isLoggedIn", "true");
        } else {
          handleLogoutCleanup();
        }
      } else {
        handleLogoutCleanup();
      }
    } catch (error) {
      if (error?.response?.status !== 401) {
        authLogger.error("Auth init failed:", error);
      }
      handleLogoutCleanup();
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogoutCleanup = () => {
    clearAuthData();
    localStorage.removeItem("isLoggedIn");
    setUser(null);
    setIsAuthenticated(false);
  };

  const login = async (email, password) => {
    try {
      setError(null);
      setIsLoading(true);
      const data = await AuthService.login(email, password);
      setUser(data.user);
      setIsAuthenticated(true);
      setAuthData(data.user);
      localStorage.setItem("isLoggedIn", "true");
      return data;
    } catch (error) {
      setError(error.message || "Błąd logowania");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await AuthService.logout();
    } finally {
      handleLogoutCleanup();
      setError(null);
      setIsLoading(false);
    }
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    isAdmin: user?.role === 'admin',
    isModerator: ['admin', 'moderator'].includes(user?.role)
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;`,
      },
      {
        name: "SearchFormUpdated.js",
        language: "javascript",
        content: `import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useFiltersData } from "../../hooks/useFiltersData";
import { useSearchStats } from "./hooks/useSearchStats";
import ComboRangeFilter from "./filters/ComboRangeFilter";
import SearchableDropdown from "./SearchableDropdown";
import { Button } from "../ui";
import {
  baseFilters,
  advancedFilters,
  fuelTypes,
  gearboxTypes,
  driveTypes,
  regions,
  carBodyTypes,
} from "./SearchFormConstants";

const SearchFormUpdated = ({
  initialFilters = {},
  onSearch,
  isCompact = false,
  className = "",
  variant = "default",
}) => {
  const navigate = useNavigate();
  const { filterOptions, loading } = useFiltersData();
  const { trackSearch } = useSearchStats();
  const [filters, setFilters] = useState(initialFilters);
  const [isAdvancedVisible, setIsAdvancedVisible] = useState(false);

  useEffect(() => {
    if (Object.keys(initialFilters).length > 0) {
      setFilters(initialFilters);
      const hasAdvancedFilters = Object.keys(initialFilters).some((key) =>
        advancedFilters.some((f) => f.id === key)
      );
      if (hasAdvancedFilters) setIsAdvancedVisible(true);
    }
  }, [initialFilters]);

  const handleInputChange = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
    if (name === "brand") setFilters((prev) => ({ ...prev, model: "", generation: "" }));
    if (name === "model") setFilters((prev) => ({ ...prev, generation: "" }));
  };

  const handleRangeChange = (type, values) => {
    setFilters((prev) => ({
      ...prev,
      [\`\${type}Min\`]: values.min,
      [\`\${type}Max\`]: values.max,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const activeFilters = Object.entries(filters).reduce(
      (acc, [key, value]) => {
        if (value !== "" && value != null) acc[key] = value;
        return acc;
      },
      {}
    );

    trackSearch(activeFilters);

    if (onSearch) {
      onSearch(activeFilters);
    } else {
      const searchParams = new URLSearchParams(activeFilters);
      navigate(\`/ogloszenia?\${searchParams.toString()}\`);
    }
  };

  if (loading) return <div className="p-4">Ładowanie filtrów...</div>;

  return (
    <form onSubmit={handleSubmit} className={\`bg-white p-6 rounded-lg shadow-md \${className}\`}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <SearchableDropdown
          label="Marka"
          value={filters.brand}
          onChange={(val) => handleInputChange("brand", val)}
          options={filterOptions.brands || []}
          placeholder="Wybierz markę"
        />

        <SearchableDropdown
          label="Model"
          value={filters.model}
          onChange={(val) => handleInputChange("model", val)}
          options={filterOptions.models?.[filters.brand] || []}
          placeholder="Wybierz model"
          disabled={!filters.brand}
        />

        <ComboRangeFilter
          label="Cena"
          min={filters.priceMin}
          max={filters.priceMax}
          onChange={(vals) => handleRangeChange("price", vals)}
          unit="PLN"
          presets={[10000, 30000, 50000, 100000]}
        />
        
        <ComboRangeFilter
          label="Rocznik"
          min={filters.yearMin}
          max={filters.yearMax}
          onChange={(vals) => handleRangeChange("year", vals)}
          unit=""
          minVal={1990}
          maxVal={new Date().getFullYear()}
        />
      </div>

      {isAdvancedVisible && (
        <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-1">Paliwo</label>
            <select
              value={filters.fuelType || ""}
              onChange={(e) => handleInputChange("fuelType", e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm"
            >
              <option value="">Wszystkie</option>
              {fuelTypes.map((type) => <option key={type} value={type}>{type}</option>)}
            </select>
          </div>
           {/* Więcej filtrów... */}
        </div>
      )}

      <div className="flex justify-between items-center mt-6 pt-2">
        <button
          type="button"
          onClick={() => setIsAdvancedVisible(!isAdvancedVisible)}
          className="text-sm text-blue-600 hover:underline"
        >
          {isAdvancedVisible ? "Mniej filtrów" : "Więcej filtrów"}
        </button>

        <Button variant="primary" type="submit" className="px-8">Szukaj</Button>
      </div>
    </form>
  );
};

export default SearchFormUpdated;`,
      },
      {
        name: "client.js",
        language: "javascript",
        content: `import axios from 'axios';
import { API_URL } from '../../config/designSystem';

const client = axios.create({
  baseURL: API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

client.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise(function(resolve, reject) {
          failedQueue.push({resolve, reject});
        })
        .then(token => {
          return client(originalRequest);
        })
        .catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await client.post('/auth/refresh-token');
        processQueue(null);
        isRefreshing = false;
        return client(originalRequest);
      } catch (err) {
        processQueue(err, null);
        isRefreshing = false;
        return Promise.reject(err);
      }
    }
    
    return Promise.reject(error);
  }
);

export default client;`,
      },
      {
        name: "useConversations.js",
        language: "javascript",
        content: `import { useState, useEffect, useCallback, useRef } from "react";
import messagesApi from "../../../services/api/messagesApi";
import { useAuth } from "../../../contexts/AuthContext";
import { useSocket } from "../../../contexts/SocketContext";

const conversationsCache = {
  inbox: { data: [], timestamp: 0 },
  sent: { data: [], timestamp: 0 },
  archived: { data: [], timestamp: 0 },
  trash: { data: [], timestamp: 0 },
};

const CACHE_TTL = 30000;

export const useConversations = (activeFolder = "inbox") => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const socket = useSocket();
  const mounted = useRef(true);

  const fetchConversations = useCallback(
    async (force = false) => {
      if (!user) return;

      const now = Date.now();
      const cached = conversationsCache[activeFolder];

      if (!force && cached && now - cached.timestamp < CACHE_TTL) {
        if (mounted.current) {
          setConversations(cached.data);
          setLoading(false);
        }
        return;
      }

      setLoading(true);
      try {
        const response = await messagesApi.getConversations(activeFolder);
        const data = response.data || [];
        conversationsCache[activeFolder] = { data: data, timestamp: now };

        if (mounted.current) {
          setConversations(data);
          setError(null);
        }
      } catch (err) {
        console.error("Error fetching conversations:", err);
        if (mounted.current) setError("Nie udało się pobrać wiadomości");
      } finally {
        if (mounted.current) setLoading(false);
      }
    },
    [activeFolder, user]
  );

  useEffect(() => {
    mounted.current = true;
    fetchConversations();
    return () => { mounted.current = false; };
  }, [fetchConversations]);

  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (message) => {
      if (activeFolder === "inbox") {
        setConversations((prev) => {
          const idx = prev.findIndex((c) => c.id === message.conversationId);
          if (idx > -1) {
            const updated = [...prev];
            updated[idx] = {
              ...updated[idx],
              lastMessage: message,
              hasUnread: true,
              updatedAt: new Date().toISOString(),
            };
            return [updated[idx], ...updated.filter((_, i) => i !== idx)];
          } else {
            fetchConversations(true);
            return prev;
          }
        });
      }
    };

    socket.on("new_message", handleNewMessage);
    return () => { socket.off("new_message", handleNewMessage); };
  }, [socket, activeFolder, fetchConversations]);

  const markAsRead = async (conversationId) => {
    try {
      await messagesApi.markAsRead(conversationId);
      setConversations((prev) =>
        prev.map((c) => (c.id === conversationId ? { ...c, hasUnread: false } : c))
      );
    } catch (err) { console.error(err); }
  };

  return {
    conversations,
    loading,
    error,
    refreshConversations: () => fetchConversations(true),
    markAsRead,
  };
};`,
      },
    ],
  },

  // ---------------------------------------------------------------------------
  // 2. BACKEND (Node.js, Express, Socket.IO, MongoDB)
  // ---------------------------------------------------------------------------
  {
    name: "BACKEND",
    language: "typescript",
    isOpen: true,
    children: [
      {
        name: "socketService.js",
        language: "javascript",
        content: `import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import SocketConnectionManager from "./socket/SocketConnectionManager.js";
import SocketConversationManager from "./socket/SocketConversationManager.js";
import User from "../models/user/user.js";

/**
 * 🔌 SocketService - Real-time communication core
 * Manages WebSocket connections, authentication, and event delegation.
 */
class SocketService {
  constructor() {
    this.io = null;
    this.connectionManager = new SocketConnectionManager();
    this.conversationManager = new SocketConversationManager();
  }

  initialize(server) {
    this.io = new Server(server, {
      cors: {
        origin: [process.env.CLIENT_URL, "https://autosell.pl"],
        methods: ["GET", "POST"],
        credentials: true,
      },
      pingTimeout: 60000,
    });

    // JWT Authentication Middleware for WebSockets
    this.io.use(async (socket, next) => {
      try {
        const token = socket.handshake.auth.token;
        if (!token) return next(new Error("Authentication error: No token"));

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select("-password");
        if (!user) return next(new Error("User not found"));

        socket.user = user;
        next();
      } catch (err) {
        next(new Error("Invalid token"));
      }
    });

    this.io.on("connection", (socket) => this.handleConnection(socket));
    console.log("✅ Socket.io initialized");
  }

  handleConnection(socket) {
    const userId = socket.user._id.toString();
    socket.join(userId); // User's private room
    
    this.connectionManager.addUser(userId, socket.id);
    this.io.emit("user_status_change", { userId, isOnline: true });

    socket.on("join_conversation", (id) => socket.join(id));
    socket.on("typing_start", ({ conversationId }) => {
      socket.to(conversationId).emit("user_typing", { conversationId, userId, isTyping: true });
    });

    socket.on("disconnect", () => {
      this.connectionManager.removeUser(userId, socket.id);
      if (!this.connectionManager.isUserOnline(userId)) {
        this.io.emit("user_status_change", { userId, isOnline: false });
      }
    });
  }
}

export default new SocketService();`,
      },
      {
        name: "adController.js",
        language: "javascript",
        content: `import Ad from "../../models/listings/ad.js";
import { buildListingAggregation } from "../../utils/listings/aggregationHelpers.js";
import { catchAsync } from "../../utils/asyncHandler.js";

/**
 * Main Listings Controller
 * Handles vehicle searches with advanced aggregation and creation logic.
 */
export const getAds = catchAsync(async (req, res, next) => {
  const filters = req.query;
  const userId = req.user ? req.user._id : null;

  // Build MongoDB Aggregation Pipeline for complex filtering
  const pipeline = buildListingAggregation(filters, userId);
  
  const result = await Ad.aggregate(pipeline);
  const { metadata, data } = result[0];
  const total = metadata[0] ? metadata[0].total : 0;

  res.status(200).json({
    status: "success",
    results: data.length,
    total,
    data,
  });
});

export const createAd = catchAsync(async (req, res, next) => {
  // Check listing limits for private accounts
  if (req.user.accountType === 'private') {
    const adCount = await Ad.countDocuments({ seller: req.user._id, status: 'active' });
    if (adCount >= 3) {
      return res.status(403).json({ message: "Free limit reached" });
    }
  }

  const newAd = await Ad.create({
    ...req.body,
    seller: req.user._id,
    status: "pending_review",
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // +30 days
  });

  res.status(201).json({ status: "success", data: { ad: newAd } });
});`,
      },
      {
        name: "aggregationHelpers.js",
        language: "javascript",
        content: `/**
 * MongoDB Aggregation Pipeline Builder
 * Constructs complex search queries for the listing engine.
 */
import mongoose from "mongoose";

export const buildListingAggregation = (filters, userId = null) => {
  const pipeline = [
    { 
      $match: { 
        status: "active", 
        isDeleted: false,
        // Dynamic filters based on query params
        ...(filters.brand && { "technicalData.brand": filters.brand }),
        ...(filters.model && { "technicalData.model": filters.model }),
        ...(filters.priceMin && { price: { $gte: Number(filters.priceMin) } }),
        ...(filters.priceMax && { price: { $lte: Number(filters.priceMax) } })
      } 
    },
    {
      $lookup: {
        from: "users",
        localField: "seller",
        foreignField: "_id",
        as: "sellerData",
        pipeline: [{ $project: { firstName: 1, lastName: 1, avatar: 1, isVerified: 1 } }]
      }
    },
    { $unwind: "$sellerData" }
  ];

  // If user is logged in, check if they "Favorited" the listing
  if (userId) {
    pipeline.push({
      $lookup: {
        from: "favorites",
        let: { adId: "$_id" },
        pipeline: [
          { 
            $match: { 
              $expr: { 
                $and: [
                  { $eq: ["$ad", "$$adId"] },
                  { $eq: ["$user", mongoose.Types.ObjectId(userId)] }
                ]
              }
            } 
          }
        ],
        as: "isFavorite"
      }
    }, {
      $addFields: { isFavorite: { $gt: [{ $size: "$isFavorite" }, 0] } }
    });
  }

  // Pagination Facet
  const page = Number(filters.page) || 1;
  const limit = Number(filters.limit) || 20;
  
  pipeline.push({
    $facet: {
      metadata: [{ $count: "total" }],
      data: [{ $skip: (page - 1) * limit }, { $limit: limit }]
    }
  });

  return pipeline;
};`,
      },
      {
        name: "auth.js",
        language: "javascript",
        content: `/**
 * JWT Authentication Middleware
 * Securely extracts and verifies tokens from HttpOnly cookies or Headers.
 */
import jwt from "jsonwebtoken";
import User from "../models/user/user.js";
import { AppError } from "../utils/appError.js";

const auth = async (req, res, next) => {
  try {
    let token;
    // Prefer HttpOnly cookies for security
    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    } else if (req.headers.authorization?.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) return next(new AppError("Not authorized.", 401));

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) return next(new AppError("User no longer exists.", 401));
    
    // Security: Check if user changed password AFTER token issuance
    if (user.changedPasswordAfter(decoded.iat)) {
      return next(new AppError("Password changed. Please log in again.", 401));
    }

    req.user = user;
    next();
  } catch (error) {
    next(new AppError("Invalid or expired token.", 401));
  }
};

export default auth;`,
      },
      {
        name: "conversations.js",
        language: "javascript",
        content: `import Message from "../../models/communication/message.js";
import Conversation from "../../models/communication/conversation.js";
import socketService from "../../services/socketService.js";
import mongoose from "mongoose";

/**
 * Message Controller
 * Handles sending messages with transactional integrity and real-time updates.
 */
export const sendMessage = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const senderId = req.user._id;
    const { recipientId, adId, content, tempId } = req.body;

    // 1. Find existing conversation or create new
    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, recipientId] },
      adId: adId
    });

    if (!conversation) {
      conversation = await Conversation.create([{
        participants: [senderId, recipientId],
        adId: adId
      }], { session });
      conversation = conversation[0];
    }

    // 2. Create the message
    const newMessage = await Message.create([{
      conversationId: conversation._id,
      senderId,
      recipientId,
      content,
      adId
    }], { session });

    // 3. Update conversation state (last message, unread status)
    await Conversation.findByIdAndUpdate(conversation._id, {
      lastMessage: newMessage[0]._id,
      updatedAt: new Date(),
      $pull: { isDeleted: { $in: [senderId, recipientId] } } 
    }, { session });

    await session.commitTransaction();

    // 4. Emit real-time update via Socket.IO
    socketService.io.to(recipientId).emit("new_message", {
      ...newMessage[0].toObject(),
      conversationId: conversation._id,
      tempId
    });

    res.status(201).json({ status: "success", data: newMessage[0] });
  } catch (err) {
    await session.abortTransaction();
    next(err);
  } finally {
    session.endSession();
  }
};`,
      },
    ],
  },

  // ---------------------------------------------------------------------------
  // 3. PROJECT DOCUMENTATION
  // ---------------------------------------------------------------------------
  {
    name: "README.md",
    language: "markdown",
    content: `# Autosell.pl - Enterprise Automotive Marketplace

## Overview
Autosell.pl is a scalable, full-stack automotive marketplace platform designed to connect vehicle buyers and sellers. It features a modern, responsive frontend and a robust, secure backend architecture capable of handling complex search queries and real-time communication.

## Key Features

### 🚗 Advanced Vehicle Search
- **Dynamic Filtering:** Server-side aggregation pipeline (\`aggregationHelpers.js\`) allows filtering by 30+ parameters (Brand, Model, Year, Price, etc.).
- **Performance:** Optimized MongoDB indexes ensure fast query execution even with large datasets.

### 💬 Real-Time Messaging System
- **WebSocket Integration:** Powered by \`Socket.io\` (\`socketService.js\`) for instant message delivery and status updates (online/offline).
- **Transactional Integrity:** Uses MongoDB Transactions (\`conversations.js\`) to ensure data consistency between messages and conversation threads.

### 🔐 Secure Authentication & Authorization
- **JWT Strategy:** Implements secure, HttpOnly cookie-based authentication (\`auth.js\`) to prevent XSS attacks.
- **Context-Aware State:** Frontend \`AuthContext\` manages user sessions with automatic token refresh mechanisms (\`client.js\` interceptors).

### 🛠️ Professional Engineering Practices
- **Custom Hooks:** Encapsulated logic for forms (\`useListingForm\`), messaging (\`useConversations\`), and search (\`SearchFormUpdated\`).
- **Clean Architecture:** Backend organized into Controllers, Services, and Models for maintainability.
- **Error Handling:** Centralized error handling on both client and server sides.

## Tech Stack

**Frontend:**
- React 18
- Context API & Custom Hooks
- Axios (w/ Interceptors)
- Tailwind CSS

**Backend:**
- Node.js & Express
- MongoDB (Mongoose & Aggregations)
- Socket.io (Real-time)
- JWT & HttpOnly Cookies

## Code Highlights (Included in Portfolio)
- **Frontend Core:** \`useListingForm.js\`, \`AuthContext.js\`, \`SearchFormUpdated.js\`
- **Backend Core:** \`socketService.js\`, \`adController.js\`, \`aggregationHelpers.js\`
`,
  },
];
