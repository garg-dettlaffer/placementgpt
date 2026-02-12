import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { databases, DATABASE_ID, client } from '../services/appwrite';
import { Query } from 'appwrite';
import { useAuth } from '../hooks/useAuth';
import Navbar from '../components/layout/Navbar';
import Sidebar from '../components/layout/Sidebar';
import toast from 'react-hot-toast';
import { formatDistanceToNow, isToday, isYesterday, isThisWeek, parseISO } from 'date-fns';
import {
  Bell,
  CheckCheck,
  Trash2,
  Filter,
  Calendar,
  Code,
  Trophy,
  Briefcase,
  AlertCircle,
  X,
  Settings
} from 'lucide-react';

const NOTIFICATIONS_COLLECTION = 'notifications';

// Notification type configurations
const NOTIFICATION_TYPES = {
  interview: {
    icon: Calendar,
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20'
  },
  problems: {
    icon: Code,
    color: 'text-purple-500',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/20'
  },
  achievement: {
    icon: Trophy,
    color: 'text-yellow-500',
    bg: 'bg-yellow-500/10',
    border: 'border-yellow-500/20'
  },
  placement: {
    icon: Briefcase,
    color: 'text-green-500',
    bg: 'bg-green-500/10',
    border: 'border-green-500/20'
  },
  system: {
    icon: Bell,
    color: 'text-gray-500',
    bg: 'bg-gray-500/10',
    border: 'border-gray-500/20'
  }
};

export default function Notifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, unread, interview, problems, achievement
  const [groupedNotifications, setGroupedNotifications] = useState({});

  // Fetch notifications
  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      
      const queries = [
        Query.equal('userId', user.$id),
        Query.orderDesc('$createdAt'),
        Query.limit(100)
      ];

      // Add filter
      if (filter === 'unread') {
        queries.push(Query.equal('isRead', false));
      } else if (filter !== 'all') {
        queries.push(Query.equal('type', filter));
      }

      const response = await databases.listDocuments(
        DATABASE_ID,
        NOTIFICATIONS_COLLECTION,
        queries
      );

      setNotifications(response.documents);
      groupNotificationsByDate(response.documents);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      
      // If collection doesn't exist, show empty state
      if (error.code === 404) {
        setNotifications([]);
        setGroupedNotifications({});
      } else {
        toast.error('Failed to load notifications');
      }
    } finally {
      setLoading(false);
    }
  }, [user.$id, filter]);

  // Group notifications by date
  const groupNotificationsByDate = (notifs) => {
    const grouped = {
      today: [],
      yesterday: [],
      thisWeek: [],
      older: []
    };

    notifs.forEach(notif => {
      const date = parseISO(notif.$createdAt);
      
      if (isToday(date)) {
        grouped.today.push(notif);
      } else if (isYesterday(date)) {
        grouped.yesterday.push(notif);
      } else if (isThisWeek(date)) {
        grouped.thisWeek.push(notif);
      } else {
        grouped.older.push(notif);
      }
    });

    setGroupedNotifications(grouped);
  };

  // Mark notification as read
  const markAsRead = async (notificationId) => {
    try {
      await databases.updateDocument(
        DATABASE_ID,
        NOTIFICATIONS_COLLECTION,
        notificationId,
        { isRead: true }
      );

      setNotifications(prev =>
        prev.map(n => n.$id === notificationId ? { ...n, isRead: true } : n)
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  // Mark all as read
  const markAllAsRead = async () => {
    try {
      const unreadNotifs = notifications.filter(n => !n.isRead);
      
      await Promise.all(
        unreadNotifs.map(notif =>
          databases.updateDocument(
            DATABASE_ID,
            NOTIFICATIONS_COLLECTION,
            notif.$id,
            { isRead: true }
          )
        )
      );

      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      toast.success('All notifications marked as read');
    } catch (error) {
      console.error('Error marking all as read:', error);
      toast.error('Failed to mark all as read');
    }
  };

  // Delete notification
  const deleteNotification = async (notificationId) => {
    try {
      await databases.deleteDocument(
        DATABASE_ID,
        NOTIFICATIONS_COLLECTION,
        notificationId
      );

      setNotifications(prev => prev.filter(n => n.$id !== notificationId));
      toast.success('Notification deleted');
    } catch (error) {
      console.error('Error deleting notification:', error);
      toast.error('Failed to delete notification');
    }
  };

  // Clear all notifications
  const clearAll = async () => {
    if (!window.confirm('Are you sure you want to delete all notifications?')) return;

    try {
      await Promise.all(
        notifications.map(notif =>
          databases.deleteDocument(
            DATABASE_ID,
            NOTIFICATIONS_COLLECTION,
            notif.$id
          )
        )
      );

      setNotifications([]);
      setGroupedNotifications({});
      toast.success('All notifications cleared');
    } catch (error) {
      console.error('Error clearing notifications:', error);
      toast.error('Failed to clear notifications');
    }
  };

  // Setup real-time subscription
  useEffect(() => {
    const unsubscribe = client.subscribe(
      `databases.${DATABASE_ID}.collections.${NOTIFICATIONS_COLLECTION}.documents`,
      (response) => {
        if (
          response.events.includes('databases.*.collections.*.documents.*.create') &&
          response.payload.userId === user.$id
        ) {
          // New notification received
          setNotifications(prev => [response.payload, ...prev]);
          toast.custom((t) => (
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.3 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="bg-dark-800 border border-primary-500/30 rounded-lg p-4 shadow-lg max-w-md"
            >
              <div className="flex items-start gap-3">
                {React.createElement(
                  NOTIFICATION_TYPES[response.payload.type]?.icon || Bell,
                  { className: `w-5 h-5 ${NOTIFICATION_TYPES[response.payload.type]?.color || 'text-gray-500'}` }
                )}
                <div className="flex-1">
                  <p className="font-semibold text-white text-sm">{response.payload.title}</p>
                  <p className="text-xs text-gray-400 mt-1">{response.payload.message}</p>
                </div>
                <button onClick={() => toast.dismiss(t.id)} className="text-gray-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ), { duration: 5000 });
        }
      }
    );

    return () => {
      unsubscribe();
    };
  }, [user.$id]);

  // Initial fetch
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Re-group when notifications change
  useEffect(() => {
    groupNotificationsByDate(notifications);
  }, [notifications]);

  // Render notification card
  const renderNotification = (notif) => {
    const config = NOTIFICATION_TYPES[notif.type] || NOTIFICATION_TYPES.system;
    const Icon = config.icon;

    return (
      <motion.div
        key={notif.$id}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        onClick={() => !notif.isRead && markAsRead(notif.$id)}
        className={`group relative p-5 rounded-xl transition-all duration-300 cursor-pointer hover:bg-dark-700/30 border-l-4 ${
          notif.isRead ? 'bg-dark-800/30' : `${config.bg} ${config.border}`
        }`}
      >
        {!notif.isRead && (
          <div className="absolute top-4 right-4 w-2.5 h-2.5 rounded-full bg-primary-500 animate-pulse"></div>
        )}

        <div className="flex gap-4">
          <div className={`flex-shrink-0 w-12 h-12 rounded-lg ${config.bg} border ${config.border} flex items-center justify-center`}>
            <Icon className={`w-6 h-6 ${config.color}`} />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-white mb-1">{notif.title}</h3>
            <p className="text-sm text-gray-400 mb-2">{notif.message}</p>
            
            {notif.actionUrl && (
              <button className="text-xs text-primary-400 hover:text-primary-300 font-medium">
                View Details →
              </button>
            )}

            <p className="text-xs text-gray-600 mt-2">
              {formatDistanceToNow(parseISO(notif.$createdAt), { addSuffix: true })}
            </p>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              deleteNotification(notif.$id);
            }}
            className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-red-500/10 rounded-lg"
          >
            <Trash2 className="w-4 h-4 text-red-500" />
          </button>
        </div>
      </motion.div>
    );
  };

  // Render group section
  const renderGroup = (title, notifs) => {
    if (notifs.length === 0) return null;

    return (
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-4">
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">{title}</h3>
          <div className="h-[1px] flex-grow bg-gradient-to-r from-gray-700 to-transparent"></div>
        </div>
        <div className="space-y-3">
          {notifs.map(notif => renderNotification(notif))}
        </div>
      </motion.section>
    );
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="h-screen flex flex-col bg-dark-50 dark:bg-dark-900">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-4 py-8">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8"
            >
              <div>
                <h1 className="text-3xl font-bold text-white mb-1">Notifications</h1>
                <p className="text-gray-400 text-sm">Stay updated with your placement journey</p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={markAllAsRead}
                  disabled={unreadCount === 0}
                  className="flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <CheckCheck className="w-4 h-4" />
                  Mark all read
                </button>
                <button
                  onClick={clearAll}
                  disabled={notifications.length === 0}
                  className="p-2 rounded-lg bg-dark-800 hover:bg-dark-700 transition-colors border border-dark-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Settings className="w-5 h-5 text-white" />
                </button>
              </div>
            </motion.div>

            {/* Filter Tabs */}
            <div className="flex gap-1 p-1 bg-dark-800 rounded-lg border border-dark-700 mb-8 overflow-x-auto">
              {[
                { value: 'all', label: 'All', count: notifications.length },
                { value: 'unread', label: 'Unread', count: unreadCount },
                { value: 'interview', label: 'Interviews', icon: Calendar },
                { value: 'problems', label: 'Problems', icon: Code },
                { value: 'achievement', label: 'Achievements', icon: Trophy }
              ].map(tab => (
                <button
                  key={tab.value}
                  onClick={() => setFilter(tab.value)}
                  className={`flex items-center gap-2 px-4 py-2 rounded text-sm font-medium transition-all whitespace-nowrap ${
                    filter === tab.value
                      ? 'bg-primary-600 text-white shadow-lg'
                      : 'text-gray-400 hover:text-white hover:bg-dark-700'
                  }`}
                >
                  {tab.icon && <tab.icon className="w-4 h-4" />}
                  {tab.label}
                  {tab.count !== undefined && tab.count > 0 && (
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      filter === tab.value ? 'bg-white/20' : 'bg-primary-600/20 text-primary-400'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Notifications List */}
            {loading ? (
              // Loading skeletons
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <div key={idx} className="card p-5 animate-pulse">
                    <div className="flex gap-4">
                      <div className="w-12 h-12 bg-dark-700 rounded-lg"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-dark-700 rounded w-1/3 mb-2"></div>
                        <div className="h-3 bg-dark-700 rounded w-2/3 mb-2"></div>
                        <div className="h-3 bg-dark-700 rounded w-1/4"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : notifications.length === 0 ? (
              // Empty state
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-20"
              >
                <Bell className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No notifications yet</h3>
                <p className="text-gray-400">
                  When you get notifications, they'll show up here
                </p>
              </motion.div>
            ) : (
              // Grouped notifications
              <AnimatePresence>
                {renderGroup('Today', groupedNotifications.today || [])}
                {renderGroup('Yesterday', groupedNotifications.yesterday || [])}
                {renderGroup('This Week', groupedNotifications.thisWeek || [])}
                {renderGroup('Older', groupedNotifications.older || [])}
              </AnimatePresence>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
