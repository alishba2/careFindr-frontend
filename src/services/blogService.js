import axios from './axiosConfig'; // Adjust import path as needed

const backendUrl = import.meta.env.VITE_APP_BASE_URL;

// ========================= BLOG CRUD OPERATIONS ========================= //

// Create new blog post
export const createBlog = async (blogData) => {
  try {
    console.log("Creating blog post with data:", blogData);

    const formData = new FormData();
    Object.keys(blogData).forEach(key => {
      if (key === 'tags' && Array.isArray(blogData[key])) {
        formData.append(key, blogData[key].join(','));
      } else if (key === 'seo' && typeof blogData[key] === 'object') {
        formData.append(key, JSON.stringify(blogData[key]));
      } else if (key === 'featuredImage' && blogData[key] instanceof File) {
        formData.append(key, blogData[key]);
      } else if (blogData[key] !== null && blogData[key] !== undefined) {
        formData.append(key, blogData[key]);
      }
    });

    const response = await axios.post(`${backendUrl}/api/blogs`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error creating blog:", error);
    throw error;
  }
};

// Get all blogs (admin view with filtering)
export const getAllBlogs = async (params = {}) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      category,
      author,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = params;

    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      sortBy,
      sortOrder
    });

    // Add optional parameters
    if (status) queryParams.append('status', status);
    if (category) queryParams.append('category', category);
    if (author) queryParams.append('author', author);
    if (search) queryParams.append('search', search);

    const response = await axios.get(`${backendUrl}/api/blogs?${queryParams}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching blogs:", error);
    throw error;
  }
};

// Get published blogs (public view)
export const getPublishedBlogs = async (params = {}) => {
  try {
    const { page = 1, limit = 10, category, search } = params;

    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString()
    });

    if (category) queryParams.append('category', category);
    if (search) queryParams.append('search', search);

    const response = await axios.get(`${backendUrl}/api/blogs/published?${queryParams}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching published blogs:", error);
    throw error;
  }
};

// Get single blog by ID (admin view)
export const getBlogById = async (id) => {
  try {
    const response = await axios.get(`${backendUrl}/api/blogs/${id}`);
    console.log(response.data.blog, "Blog details");
    return response.data.blog;
  } catch (error) {
    console.error("Error fetching blog by ID:", error);
    throw error;
  }
};

// Get single published blog by ID or slug (public view)
export const getPublishedBlogById = async (id) => {
  try {
    const response = await axios.get(`${backendUrl}/api/blogs/public/${id}`);
    return response.data.blog;
  } catch (error) {
    console.error("Error fetching published blog:", error);
    throw error;
  }
};

// Update blog post
export const updateBlog = async (id, blogData) => {
  try {
    console.log(`Updating blog ${id} with data:`, blogData);

    // Create FormData for file upload support
    const formData = new FormData();

    // Append all blog fields to FormData
    Object.keys(blogData).forEach(key => {
      if (key === 'tags' && Array.isArray(blogData[key])) {
        formData.append(key, blogData[key].join(','));
      } else if (key === 'seo' && typeof blogData[key] === 'object') {
        formData.append(key, JSON.stringify(blogData[key]));
      } else if (key === 'featuredImage' && blogData[key] instanceof File) {
        formData.append(key, blogData[key]);
      } else if (blogData[key] !== null && blogData[key] !== undefined) {
        formData.append(key, blogData[key]);
      }
    });

    const response = await axios.put(`${backendUrl}/api/blogs/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error updating blog:", error);
    throw error;
  }
};

// Delete blog post
export const deleteBlog = async (id) => {
  try {
    console.log(`Deleting blog ${id}...`);
    const response = await axios.delete(`${backendUrl}/api/blogs/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting blog:", error);
    throw error;
  }
};

// ========================= BLOG STATUS MANAGEMENT ========================= //

// Publish blog post
export const publishBlog = async (id) => {
  try {
    console.log(`Publishing blog ${id}...`);
    const response = await axios.patch(`${backendUrl}/api/blogs/${id}/publish`);
    return response.data;
  } catch (error) {
    console.error("Error publishing blog:", error);
    throw error;
  }
};

// Unpublish blog post
export const unpublishBlog = async (id) => {
  try {
    console.log(`Unpublishing blog ${id}...`);
    const response = await axios.patch(`${backendUrl}/api/blogs/${id}/unpublish`);
    return response.data;
  } catch (error) {
    console.error("Error unpublishing blog:", error);
    throw error;
  }
};

// Archive blog post
export const archiveBlog = async (id) => {
  try {
    console.log(`Archiving blog ${id}...`);
    const response = await axios.patch(`${backendUrl}/api/blogs/${id}/archive`);
    return response.data;
  } catch (error) {
    console.error("Error archiving blog:", error);
    throw error;
  }
};

// ========================= BLOG ANALYTICS & STATS ========================= //

// Get blog statistics
export const getBlogStats = async () => {
  try {
    const response = await axios.get(`${backendUrl}/api/blogs/stats`);
    return response.data;
  } catch (error) {
    console.error("Error fetching blog stats:", error);
    throw error;
  }
};

// ========================= HELPER FUNCTIONS ========================= //

// Get blogs by category
export const getBlogsByCategory = async (category, { page = 1, limit = 10 } = {}) => {
  try {
    return await getPublishedBlogs({ page, limit, category });
  } catch (error) {
    console.error(`Error fetching blogs by category ${category}:`, error);
    throw error;
  }
};

// Search blogs
export const searchBlogs = async (searchTerm, { page = 1, limit = 10, category } = {}) => {
  try {
    return await getPublishedBlogs({ page, limit, search: searchTerm, category });
  } catch (error) {
    console.error(`Error searching blogs for "${searchTerm}":`, error);
    throw error;
  }
};

// Get blogs by status (admin only)
export const getBlogsByStatus = async (status, { page = 1, limit = 10 } = {}) => {
  try {
    return await getAllBlogs({ page, limit, status });
  } catch (error) {
    console.error(`Error fetching ${status} blogs:`, error);
    throw error;
  }
};

// Get user's blogs (admin only)
export const getUserBlogs = async (authorId, { page = 1, limit = 10 } = {}) => {
  try {
    return await getAllBlogs({ page, limit, author: authorId });
  } catch (error) {
    console.error(`Error fetching blogs for author ${authorId}:`, error);
    throw error;
  }
};

// ========================= BULK OPERATIONS ========================= //

// Bulk publish blogs
export const bulkPublishBlogs = async (blogIds) => {
  try {
    const promises = blogIds.map(id => publishBlog(id));
    const results = await Promise.allSettled(promises);

    const successful = results.filter(result => result.status === 'fulfilled').length;
    const failed = results.filter(result => result.status === 'rejected').length;

    console.log(`Bulk publish completed: ${successful} successful, ${failed} failed`);
    return { successful, failed, results };
  } catch (error) {
    console.error("Error in bulk publish:", error);
    throw error;
  }
};

// Bulk unpublish blogs
export const bulkUnpublishBlogs = async (blogIds) => {
  try {
    const promises = blogIds.map(id => unpublishBlog(id));
    const results = await Promise.allSettled(promises);

    const successful = results.filter(result => result.status === 'fulfilled').length;
    const failed = results.filter(result => result.status === 'rejected').length;

    console.log(`Bulk unpublish completed: ${successful} successful, ${failed} failed`);
    return { successful, failed, results };
  } catch (error) {
    console.error("Error in bulk unpublish:", error);
    throw error;
  }
};

// Bulk delete blogs
export const bulkDeleteBlogs = async (blogIds) => {
  try {
    const promises = blogIds.map(id => deleteBlog(id));
    const results = await Promise.allSettled(promises);

    const successful = results.filter(result => result.status === 'fulfilled').length;
    const failed = results.filter(result => result.status === 'rejected').length;

    console.log(`Bulk delete completed: ${successful} successful, ${failed} failed`);
    return { successful, failed, results };
  } catch (error) {
    console.error("Error in bulk delete:", error);
    throw error;
  }
};

// Bulk archive blogs
export const bulkArchiveBlogs = async (blogIds) => {
  try {
    const promises = blogIds.map(id => archiveBlog(id));
    const results = await Promise.allSettled(promises);

    const successful = results.filter(result => result.status === 'fulfilled').length;
    const failed = results.filter(result => result.status === 'rejected').length;

    console.log(`Bulk archive completed: ${successful} successful, ${failed} failed`);
    return { successful, failed, results };
  } catch (error) {
    console.error("Error in bulk archive:", error);
    throw error;
  }
};

// ========================= UTILITY FUNCTIONS ========================= //

// Check blog status
export const checkBlogStatus = async (blogId) => {
  try {
    const blog = await getBlogById(blogId);
    return {
      id: blog._id,
      title: blog.title,
      status: blog.status,
      isDraft: blog.status === 'Draft',
      isPublished: blog.status === 'Published',
      isScheduled: blog.status === 'Scheduled',
      isArchived: blog.status === 'Archived',
      publishedAt: blog.publishedAt,
      scheduledAt: blog.scheduledAt,
      views: blog.views,
      likes: blog.likes,
      readTime: blog.readTime
    };
  } catch (error) {
    console.error("Error checking blog status:", error);
    throw error;
  }
};

// Get available categories
export const getAvailableCategories = () => {
  return [
    'Technology',
    'Design',
    'Business',
    'Marketing',
    'Lifestyle',
    'Health',
    'Travel',
    'Food',
    'Fashion',
    'Finance'
  ];
};

// Get available statuses
export const getAvailableStatuses = () => {
  return ['Draft', 'Published', 'Scheduled', 'Archived'];
};

// Format blog data for API
export const formatBlogForAPI = (blogData) => {
  return {
    title: blogData.title?.trim(),
    excerpt: blogData.excerpt?.trim(),
    content: blogData.content,
    category: blogData.category,
    status: blogData.status || 'Draft',
    tags: Array.isArray(blogData.tags) ? blogData.tags : [],
    featuredImage: blogData.featuredImage,
    scheduledAt: blogData.scheduledAt,
    seo: blogData.seo || {}
  };
};

// Convert File to base64 (for preview purposes)
export const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
};

// Validate blog data before submission
export const validateBlogData = (blogData) => {
  const errors = {};

  if (!blogData.title?.trim()) {
    errors.title = 'Title is required';
  } else if (blogData.title.length > 200) {
    errors.title = 'Title must be less than 200 characters';
  }

  if (!blogData.content?.trim()) {
    errors.content = 'Content is required';
  }

  if (blogData.excerpt && blogData.excerpt.length > 500) {
    errors.excerpt = 'Excerpt must be less than 500 characters';
  }

  if (blogData.status === 'Scheduled' && !blogData.scheduledAt) {
    errors.scheduledAt = 'Scheduled date is required for scheduled posts';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Generate blog excerpt from content
export const generateExcerpt = (content, maxLength = 150) => {
  if (!content) return '';

  // Remove HTML tags
  const textContent = content.replace(/<[^>]*>/g, '');

  // Truncate to maxLength
  if (textContent.length <= maxLength) {
    return textContent;
  }

  return textContent.substring(0, maxLength).trim() + '...';
};

// Calculate reading time from content
export const calculateReadingTime = (content) => {
  if (!content) return '1 min read';

  const textContent = content.replace(/<[^>]*>/g, '');
  const wordCount = textContent.split(' ').filter(word => word.length > 0).length;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  return `${readingTime} min read`;
};

// Export default object with all functions
export default {
  // CRUD Operations
  createBlog,
  getAllBlogs,
  getPublishedBlogs,
  getBlogById,
  getPublishedBlogById,
  updateBlog,
  deleteBlog,

  // Status Management
  publishBlog,
  unpublishBlog,
  archiveBlog,

  // Analytics
  getBlogStats,

  // Helper Functions
  getBlogsByCategory,
  searchBlogs,
  getBlogsByStatus,
  getUserBlogs,

  // Bulk Operations
  bulkPublishBlogs,
  bulkUnpublishBlogs,
  bulkDeleteBlogs,
  bulkArchiveBlogs,

  // Utilities
  checkBlogStatus,
  getAvailableCategories,
  getAvailableStatuses,
  formatBlogForAPI,
  fileToBase64,
  validateBlogData,
  generateExcerpt,
  calculateReadingTime
};