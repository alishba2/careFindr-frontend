import React, { useState, useRef, useEffect } from 'react';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Link,
  Image,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Code,
  Eye,
  Save,
  Upload,
  ChevronDown,
  Loader2,
  Type,
  Quote,
  Minus,
  Plus,
  Edit,
  Trash2,
  MoreHorizontal,
  Calendar,
  FileText,
  Send,
  Archive,
  Search,
  Filter,
  RefreshCw,
  ExternalLink
} from 'lucide-react';

// Import your blog service
import {
  createBlog,
  getAllBlogs,
  updateBlog,
  deleteBlog,
  publishBlog,
  unpublishBlog,
  archiveBlog,
  getBlogStats,
  validateBlogData,
  calculateReadingTime
} from '../../services/blogService';

// Rich Text Editor Component (same as before)
const RichTextEditor = ({ value, onChange, disabled }) => {
  const editorRef = useRef(null);
  const [isPreview, setIsPreview] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (editorRef.current && !disabled && !isUpdating) {
      const selection = window.getSelection();
      const range = selection.rangeCount > 0 ? selection.getRangeAt(0) : null;
      const offset = range ? range.startOffset : 0;

      if (editorRef.current.innerHTML !== value) {
        editorRef.current.innerHTML = value;

        if (range && editorRef.current.firstChild) {
          try {
            const newRange = document.createRange();
            const textNode = editorRef.current.firstChild;
            newRange.setStart(textNode, Math.min(offset, textNode.textContent?.length || 0));
            newRange.collapse(true);
            selection.removeAllRanges();
            selection.addRange(newRange);
          } catch (e) {
            // Ignore cursor positioning errors
          }
        }
      }
    }
  }, [value, disabled, isUpdating]);

  const execCommand = (command, value = null) => {
    document.execCommand(command, false, value);
    updateContent();
    editorRef.current?.focus();
  };

  const updateContent = () => {
    if (editorRef.current && onChange && !isUpdating) {
      setIsUpdating(true);
      const content = editorRef.current.innerHTML;
      onChange(content);
      setTimeout(() => setIsUpdating(false), 0);
    }
  };

  const handleKeyDown = (e) => {
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 'b':
          e.preventDefault();
          execCommand('bold');
          break;
        case 'i':
          e.preventDefault();
          execCommand('italic');
          break;
        case 'u':
          e.preventDefault();
          execCommand('underline');
          break;
      }
    }
  };

  const insertLink = () => {
    const url = prompt('Enter URL:');
    if (url) execCommand('createLink', url);
  };

  const insertImage = () => {
    const url = prompt('Enter image URL:');
    if (url) execCommand('insertImage', url);
  };

  const formatBlock = (tag) => {
    execCommand('formatBlock', tag);
  };

  const EditorToolbar = () => (
    <div className="flex flex-wrap items-center gap-1 p-2 border-b border-gray-200 bg-gray-50">
      <div className="flex items-center gap-1">
        <button type="button" onClick={() => execCommand('bold')} className="p-2 hover:bg-gray-200 rounded transition-colors" title="Bold (Ctrl+B)" disabled={disabled}>
          <Bold size={16} />
        </button>
        <button type="button" onClick={() => execCommand('italic')} className="p-2 hover:bg-gray-200 rounded transition-colors" title="Italic (Ctrl+I)" disabled={disabled}>
          <Italic size={16} />
        </button>
        <button type="button" onClick={() => execCommand('underline')} className="p-2 hover:bg-gray-200 rounded transition-colors" title="Underline (Ctrl+U)" disabled={disabled}>
          <Underline size={16} />
        </button>
        <button type="button" onClick={() => execCommand('strikeThrough')} className="p-2 hover:bg-gray-200 rounded transition-colors" title="Strikethrough" disabled={disabled}>
          <Strikethrough size={16} />
        </button>
      </div>

      <div className="w-px h-6 bg-gray-300 mx-1"></div>

      <div className="flex items-center gap-1">
        <select onChange={(e) => formatBlock(e.target.value)} className="px-2 py-1 text-sm border border-gray-300 rounded hover:bg-gray-200" defaultValue="" disabled={disabled}>
          <option value="">Normal</option>
          <option value="h1">Heading 1</option>
          <option value="h2">Heading 2</option>
          <option value="h3">Heading 3</option>
          <option value="h4">Heading 4</option>
          <option value="p">Paragraph</option>
        </select>
      </div>

      <div className="w-px h-6 bg-gray-300 mx-1"></div>

      <div className="flex items-center gap-1">
        <button type="button" onClick={() => execCommand('insertUnorderedList')} className="p-2 hover:bg-gray-200 rounded transition-colors" title="Bullet List" disabled={disabled}>
          <List size={16} />
        </button>
        <button type="button" onClick={() => execCommand('insertOrderedList')} className="p-2 hover:bg-gray-200 rounded transition-colors" title="Numbered List" disabled={disabled}>
          <ListOrdered size={16} />
        </button>
      </div>

      <div className="w-px h-6 bg-gray-300 mx-1"></div>

      <div className="flex items-center gap-1">
        <button type="button" onClick={() => execCommand('justifyLeft')} className="p-2 hover:bg-gray-200 rounded transition-colors" title="Align Left" disabled={disabled}>
          <AlignLeft size={16} />
        </button>
        <button type="button" onClick={() => execCommand('justifyCenter')} className="p-2 hover:bg-gray-200 rounded transition-colors" title="Align Center" disabled={disabled}>
          <AlignCenter size={16} />
        </button>
        <button type="button" onClick={() => execCommand('justifyRight')} className="p-2 hover:bg-gray-200 rounded transition-colors" title="Align Right" disabled={disabled}>
          <AlignRight size={16} />
        </button>
      </div>

      <div className="w-px h-6 bg-gray-300 mx-1"></div>

      <div className="flex items-center gap-1">
        <button type="button" onClick={insertLink} className="p-2 hover:bg-gray-200 rounded transition-colors" title="Insert Link" disabled={disabled}>
          <Link size={16} />
        </button>
        <button type="button" onClick={insertImage} className="p-2 hover:bg-gray-200 rounded transition-colors" title="Insert Image" disabled={disabled}>
          <Image size={16} />
        </button>
        <button type="button" onClick={() => execCommand('insertHorizontalRule')} className="p-2 hover:bg-gray-200 rounded transition-colors" title="Insert Line" disabled={disabled}>
          <Minus size={16} />
        </button>
        <button type="button" onClick={() => formatBlock('blockquote')} className="p-2 hover:bg-gray-200 rounded transition-colors" title="Quote" disabled={disabled}>
          <Quote size={16} />
        </button>
      </div>

      <div className="w-px h-6 bg-gray-300 mx-1"></div>

      <div className="flex items-center gap-1 ml-auto">
        <button type="button" onClick={() => setIsPreview(!isPreview)} className={`p-2 rounded transition-colors ${isPreview ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-200'}`} title="Toggle Preview" disabled={disabled}>
          <Eye size={16} />
        </button>
      </div>
    </div>
  );

  if (isPreview) {
    return (
      <div className="border border-gray-300 rounded-md overflow-hidden">
        <EditorToolbar />
        <div className="p-4 min-h-[300px] bg-white">
          <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: value }} />
        </div>
      </div>
    );
  }

  return (
    <div className="border border-gray-300 rounded-md overflow-hidden">
      <EditorToolbar />
      <div
        ref={editorRef}
        contentEditable={!disabled}
        onInput={updateContent}
        onKeyDown={handleKeyDown}
        onPaste={(e) => {
          e.preventDefault();
          const text = e.clipboardData.getData('text/plain');
          document.execCommand('insertText', false, text);
        }}
        className="p-4 min-h-[300px] focus:outline-none focus:ring-2 focus:ring-blue-500 prose max-w-none"
        style={{ minHeight: '300px', maxHeight: '500px', overflowY: 'auto' }}
        data-placeholder="Start writing your blog post..."
        suppressContentEditableWarning={true}
      />
    </div>
  );
};

// Blog Form Component
const BlogForm = ({ editingBlog, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    category: '',
    status: 'Draft',
    featuredImage: null,
    content: '',
    tags: []
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [imageFile, setImageFile] = useState(null);
  const fileInputRef = useRef(null);

  const categories = [
    'Health & Wellness',
    'Women’s Health',
    'Child & Family Health',
    'Emergency Care Tips',
    'Chronic Illness Management',
    'Digital Health Literacy',
    'Product Update',
  ];

  const statuses = ['Draft', 'Published', 'Scheduled', 'Archived'];

  // Initialize form data when editing
  useEffect(() => {
    if (editingBlog) {
      setFormData({
        title: editingBlog.title || '',
        excerpt: editingBlog.excerpt || '',
        category: editingBlog.category || '',
        status: editingBlog.status || 'Draft',
        featuredImage: editingBlog.featuredImage || null,
        content: editingBlog.content || '',
        tags: editingBlog.tags || []
      });
    }
  }, [editingBlog]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, featuredImage: 'File size should be less than 5MB' }));
        return;
      }

      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({ ...prev, featuredImage: 'Please select a valid image file' }));
        return;
      }

      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData(prev => ({ ...prev, featuredImage: e.target.result }));
        setErrors(prev => ({ ...prev, featuredImage: '' }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    const { isValid, errors: validationErrors } = validateBlogData(formData);

    if (!isValid) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    try {
      const blogData = { ...formData };

      // Use the file object for API calls instead of base64
      if (imageFile) {
        blogData.featuredImage = imageFile;
      } else if (editingBlog && !imageFile) {
        // Keep existing image if no new file selected
        blogData.featuredImage = editingBlog.featuredImage;
      }

      let response;
      if (editingBlog) {
        response = await updateBlog(editingBlog._id, blogData);
      } else {
        response = await createBlog(blogData);
      }

      if (response.success) {
        onSuccess();
        // Reset form if creating new blog
        if (!editingBlog) {
          setFormData({
            title: '', excerpt: '', category: '', status: 'Draft',
            featuredImage: null, content: '', tags: []
          });
          setImageFile(null);
        }
      }
    } catch (error) {
      console.error('Error saving blog:', error);
      alert('Error saving blog post. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto p-6 bg-white rounded-lg shadow-sm">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {editingBlog ? 'Edit Blog Post' : 'Create New Blog Post'}
        </h1>
        <p className="text-gray-600">Share your thoughts and ideas with the world</p>
      </div>

      <div className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.title ? 'border-red-500' : 'border-gray-300'
              }`}
            placeholder="Enter your blog title..."
            disabled={isLoading}
          />
          {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
        </div>

        {/* Excerpt */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Excerpt (Brief Summary)
          </label>
          <textarea
            value={formData.excerpt}
            onChange={(e) => handleInputChange('excerpt', e.target.value)}
            rows={3}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.excerpt ? 'border-red-500' : 'border-gray-300'
              }`}
            placeholder="A brief summary of your blog post..."
            disabled={isLoading}
          />
          <div className="flex justify-between items-center mt-1">
            <p className="text-sm text-gray-500">
              A short summary that appears in blog listings (150-500 characters recommended).
            </p>
            <span className="text-sm text-gray-500">
              {formData.excerpt.length}/500
            </span>
          </div>
          {errors.excerpt && <p className="text-red-500 text-sm mt-1">{errors.excerpt}</p>}
        </div>

        {/* Category and Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none ${errors.category ? 'border-red-500' : 'border-gray-300'
                  }`}
                disabled={isLoading}
              >
                <option value="">-- Select Category --</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
            {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                value={formData.status}
                onChange={(e) => handleInputChange('status', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                disabled={isLoading}
              >
                {statuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Featured Image */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Featured Image
          </label>
          <div className="flex items-center gap-4">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/*"
              className="hidden"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-md flex items-center gap-2 transition-colors disabled:opacity-50"
              disabled={isLoading}
            >
              <Upload size={16} />
              Choose File
            </button>
            <span className="text-sm text-gray-500">

              {formData.featuredImage ? 'Image selected' : 'no file selected'}
            </span>
          </div>



          {formData.featuredImage && (
            <div className="mt-3">
              <img
                src={
                  imageFile
                    ? formData.featuredImage // This will be the base64 data URL for new uploads
                    : `${import.meta.env.VITE_APP_BASE_URL}/${formData.featuredImage}` // This for existing images from API
                }
                alt="Featured"
                className="w-40 h-24 object-cover rounded-md border shadow-sm"
              />
            </div>
          )}
          <p className="text-sm text-gray-500 mt-1">
            Recommended size: 1200x630 pixels. Maximum file size: 2MB.
          </p>
          {errors.featuredImage && <p className="text-red-500 text-sm mt-1">{errors.featuredImage}</p>}
        </div>

        {/* Rich Text Editor */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Content <span className="text-red-500">*</span>
          </label>
          <RichTextEditor
            value={formData.content}
            onChange={(content) => handleInputChange('content', content)}
            disabled={isLoading}
          />
          {errors.content && <p className="text-red-500 text-sm mt-1">{errors.content}</p>}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 pt-4">
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="px-6 py-2 bg-primarysolid hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-md flex items-center gap-2 transition-colors"
          >
            {isLoading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                {editingBlog ? 'Updating...' : 'Saving...'}
              </>
            ) : (
              <>
                <Save size={16} />
                {editingBlog ? 'Update Post' : 'Save Post'}
              </>
            )}
          </button>
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="px-6 py-2 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 text-gray-700 rounded-md transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

// Blog List Component
const BlogList = ({ blogs, onEdit, onRefresh, loading }) => {
  const [actionLoading, setActionLoading] = useState({});

  const handleAction = async (action, blogId) => {
    setActionLoading(prev => ({ ...prev, [blogId]: action }));
    try {
      switch (action) {
        case 'publish':
          await publishBlog(blogId);
          break;
        case 'unpublish':
          await unpublishBlog(blogId);
          break;
        case 'archive':
          await archiveBlog(blogId);
          break;
        case 'delete':
          if (window.confirm('Are you sure you want to delete this blog post?')) {
            await deleteBlog(blogId);
          } else {
            setActionLoading(prev => ({ ...prev, [blogId]: null }));
            return;
          }
          break;
      }
      onRefresh();
    } catch (error) {
      console.error(`Error ${action}ing blog:`, error);
      alert(`Failed to ${action} blog. Please try again.`);
    } finally {
      setActionLoading(prev => ({ ...prev, [blogId]: null }));
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Published': return 'bg-green-100 text-green-800';
      case 'Draft': return 'bg-yellow-100 text-yellow-800';
      case 'Scheduled': return 'bg-blue-100 text-blue-800';
      case 'Archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-gray-600" />
      </div>
    );
  }

  if (blogs.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No blog posts found</h3>
        <p className="text-gray-600">Create your first blog post to get started.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {blogs.map((blog) => (
        <div key={blog._id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {blog.featuredImage && (
            <img
              src={`${import.meta.env.VITE_APP_BASE_URL}/${blog.featuredImage}`}
              alt={blog.title}
              className="w-full h-48 object-cover"
            />
          )}

          <div className="p-6">
            <div className="flex items-center justify-between mb-3">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(blog.status)}`}>
                {blog.status}
              </span>
              {/* <span className="text-sm text-gray-500">{blog.readTime}</span> */}
            </div>

            <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
              {blog.title}
            </h3>

            {blog.excerpt && (
              <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                {blog.excerpt}
              </p>
            )}

            <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
              <span>{blog.category}</span>
              <span>{formatDate(blog.publishedAt || blog.createdAt)}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex space-x-2">
                <button
                  onClick={() => onEdit(blog)}
                  className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                  title="Edit"
                >
                  <Edit size={16} />
                </button>

                {blog.status === 'Draft' && (
                  <button
                    onClick={() => handleAction('publish', blog._id)}
                    disabled={actionLoading[blog._id]}
                    className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded transition-colors"
                    title="Publish"
                  >
                    {actionLoading[blog._id] === 'publish' ?
                      <Loader2 size={16} className="animate-spin" /> :
                      <Send size={16} />
                    }
                  </button>
                )}

                {blog.status === 'Published' && (
                  <button
                    onClick={() => handleAction('unpublish', blog._id)}
                    disabled={actionLoading[blog._id]}
                    className="p-2 text-gray-400 hover:text-yellow-600 hover:bg-yellow-50 rounded transition-colors"
                    title="Unpublish"
                  >
                    {actionLoading[blog._id] === 'unpublish' ?
                      <Loader2 size={16} className="animate-spin" /> :
                      <FileText size={16} />
                    }
                  </button>
                )}

                {/* <button
                  onClick={() => handleAction('archive', blog._id)}
                  disabled={actionLoading[blog._id]}
                  className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded transition-colors"
                  title="Archive"
                >
                  {actionLoading[blog._id] === 'archive' ? 
                    <Loader2 size={16} className="animate-spin" /> : 
                    <Archive size={16} />
                  }
                </button> */}

                <button
                  onClick={() => handleAction('delete', blog._id)}
                  disabled={actionLoading[blog._id]}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                  title="Delete"
                >
                  {actionLoading[blog._id] === 'delete' ?
                    <Loader2 size={16} className="animate-spin" /> :
                    <Trash2 size={16} />
                  }
                </button>
              </div>

              {/* <div className="flex items-center space-x-3 text-sm text-gray-500">
                <span className="flex items-center">
                  <Eye size={14} className="mr-1" />
                  {blog.views || 0}
                </span>
              </div> */}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Stats Component
const BlogStats = ({ stats }) => {
  if (!stats) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center">
          <div className="p-2 bg-blue-100 rounded-lg">
            <FileText className="h-6 w-6 text-blue-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Total Posts</p>
            <p className="text-2xl font-semibold text-gray-900">{stats.publishedBlogs}</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center">
          <div className="p-2 bg-yellow-100 rounded-lg">
            <Edit className="h-6 w-6 text-yellow-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Drafts</p>
            <p className="text-2xl font-semibold text-gray-900">{stats.draftBlogs}</p>
          </div>
        </div>
      </div>

      {/* <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Eye className="h-6 w-6 text-purple-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Total Views</p>
            <p className="text-2xl font-semibold text-gray-900">{stats.totalViews}</p>
          </div>
        </div>
      </div> */}
    </div>
  );
};

// Main Blog Management Component
const BlogManagement = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [blogs, setBlogs] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 9,
    total: 0
  });

  const categories = [
    'Health & Wellness',
    'Women’s Health',
    'Child & Family Health',
    'Emergency Care Tips',
    'Chronic Illness Management',
    'Digital Health Literacy',
    'Product Update',
  ];

  const tabs = [
    { id: 'all', label: 'All Posts', icon: FileText },
    { id: 'Draft', label: 'Drafts', icon: Edit },
    { id: 'Published', label: 'Published', icon: Send },
    // { id: 'Scheduled', label: 'Scheduled', icon: Calendar },
    // { id: 'Archived', label: 'Archived', icon: Archive }
  ];

  // Fetch blogs based on current filters
  const fetchBlogs = async (page = 1) => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: pagination.pageSize,
        search: searchTerm,
        category: selectedCategory
      };

      if (activeTab !== 'all') {
        params.status = activeTab;
      }

      const response = await getAllBlogs(params);
      if (response.success) {
        setBlogs(response.blogs);
        setPagination({
          current: response.pagination.current,
          pageSize: response.pagination.pageSize,
          total: response.pagination.total
        });
      }
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch stats
  const fetchStats = async () => {
    try {
      const response = await getBlogStats();
      if (response.success) {
        setStats(response.stats);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  // Initial load
  useEffect(() => {
    fetchBlogs();
    fetchStats();
  }, [activeTab, searchTerm, selectedCategory]);

  // Handle tab change
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setPagination(prev => ({ ...prev, current: 1 }));
  };

  // Handle search
  const handleSearch = (value) => {
    setSearchTerm(value);
    setPagination(prev => ({ ...prev, current: 1 }));
  };

  // Handle category filter
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setPagination(prev => ({ ...prev, current: 1 }));
  };

  // Handle edit blog
  const handleEditBlog = (blog) => {
    setEditingBlog(blog);
    setShowForm(true);
  };

  // Handle form success
  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingBlog(null);
    fetchBlogs(pagination.current);
    fetchStats();
  };

  // Handle form cancel
  const handleFormCancel = () => {
    setShowForm(false);
    setEditingBlog(null);
  };

  // Handle pagination
  const handlePageChange = (page) => {
    setPagination(prev => ({ ...prev, current: page }));
    fetchBlogs(page);
  };

  // Clear filters
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setPagination(prev => ({ ...prev, current: 1 }));
  };

  // Get filtered tab count
  const getTabCount = (tabId) => {
    if (!stats) return '';
    switch (tabId) {
      case 'all': return `(${stats.totalBlogs})`;
      case 'Draft': return `(${stats.draftBlogs})`;
      case 'Published': return `(${stats.publishedBlogs})`;
      default: return '';
    }
  };

  if (showForm) {
    return (
      <BlogForm
        editingBlog={editingBlog}
        onSuccess={handleFormSuccess}
        onCancel={handleFormCancel}
      />
    );
  }

  return (
    <div className="  mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Blog Management</h1>
          <p className="text-gray-600 mt-1">Create, manage, and publish your blog posts</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-primarysolid hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus size={20} />
          New Post
        </button>
      </div>

      {/* Stats */}
      <BlogStats stats={stats} />

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search blog posts..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <select
              value={selectedCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>

            <button
              onClick={clearFilters}
              className="px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-1"
              title="Clear Filters"
            >
              <Filter size={16} />
              Clear
            </button>

            <button
              onClick={() => fetchBlogs(pagination.current)}
              className="px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              title="Refresh"
            >
              <RefreshCw size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm ${activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                <Icon size={16} />
                {tab.label} {getTabCount(tab.id)}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Blog List */}
      <BlogList
        blogs={blogs}
        onEdit={handleEditBlog}
        onRefresh={() => {
          fetchBlogs(pagination.current);
          fetchStats();
        }}
        loading={loading}
      />

      {/* Pagination */}
      {pagination.total > pagination.pageSize && (
        <div className="mt-8 flex justify-center">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handlePageChange(pagination.current - 1)}
              disabled={pagination.current === 1}
              className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            {[...Array(Math.ceil(pagination.total / pagination.pageSize))].map((_, index) => {
              const page = index + 1;
              const isCurrentPage = page === pagination.current;

              return (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-2 text-sm font-medium rounded-md ${isCurrentPage
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                    }`}
                >
                  {page}
                </button>
              );
            })}

            <button
              onClick={() => handlePageChange(pagination.current + 1)}
              disabled={pagination.current === Math.ceil(pagination.total / pagination.pageSize)}
              className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogManagement;