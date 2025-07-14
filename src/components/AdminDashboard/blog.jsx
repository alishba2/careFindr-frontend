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
  Minus
} from 'lucide-react';



// Rich Text Editor Component
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
        
        // Restore cursor position
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
    // Handle keyboard shortcuts
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
    if (url) {
      execCommand('createLink', url);
    }
  };

  const insertImage = () => {
    const url = prompt('Enter image URL:');
    if (url) {
      execCommand('insertImage', url);
    }
  };

  const formatBlock = (tag) => {
    execCommand('formatBlock', tag);
  };

  const EditorToolbar = () => (
    <div className="flex flex-wrap items-center gap-1 p-2 border-b border-gray-200 bg-gray-50">
      {/* Text Formatting */}
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => execCommand('bold')}
          className="p-2 hover:bg-gray-200 rounded transition-colors"
          title="Bold (Ctrl+B)"
          disabled={disabled}
        >
          <Bold size={16} />
        </button>
        <button
          type="button"
          onClick={() => execCommand('italic')}
          className="p-2 hover:bg-gray-200 rounded transition-colors"
          title="Italic (Ctrl+I)"
          disabled={disabled}
        >
          <Italic size={16} />
        </button>
        <button
          type="button"
          onClick={() => execCommand('underline')}
          className="p-2 hover:bg-gray-200 rounded transition-colors"
          title="Underline (Ctrl+U)"
          disabled={disabled}
        >
          <Underline size={16} />
        </button>
        <button
          type="button"
          onClick={() => execCommand('strikeThrough')}
          className="p-2 hover:bg-gray-200 rounded transition-colors"
          title="Strikethrough"
          disabled={disabled}
        >
          <Strikethrough size={16} />
        </button>
      </div>

      <div className="w-px h-6 bg-gray-300 mx-1"></div>

      {/* Headings */}
      <div className="flex items-center gap-1">
        <select
          onChange={(e) => formatBlock(e.target.value)}
          className="px-2 py-1 text-sm border border-gray-300 rounded hover:bg-gray-200"
          defaultValue=""
          disabled={disabled}
        >
          <option value="">Normal</option>
          <option value="h1">Heading 1</option>
          <option value="h2">Heading 2</option>
          <option value="h3">Heading 3</option>
          <option value="h4">Heading 4</option>
          <option value="p">Paragraph</option>
        </select>
      </div>

      <div className="w-px h-6 bg-gray-300 mx-1"></div>

      {/* Lists */}
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => execCommand('insertUnorderedList')}
          className="p-2 hover:bg-gray-200 rounded transition-colors"
          title="Bullet List"
          disabled={disabled}
        >
          <List size={16} />
        </button>
        <button
          type="button"
          onClick={() => execCommand('insertOrderedList')}
          className="p-2 hover:bg-gray-200 rounded transition-colors"
          title="Numbered List"
          disabled={disabled}
        >
          <ListOrdered size={16} />
        </button>
      </div>

      <div className="w-px h-6 bg-gray-300 mx-1"></div>

      {/* Alignment */}
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => execCommand('justifyLeft')}
          className="p-2 hover:bg-gray-200 rounded transition-colors"
          title="Align Left"
          disabled={disabled}
        >
          <AlignLeft size={16} />
        </button>
        <button
          type="button"
          onClick={() => execCommand('justifyCenter')}
          className="p-2 hover:bg-gray-200 rounded transition-colors"
          title="Align Center"
          disabled={disabled}
        >
          <AlignCenter size={16} />
        </button>
        <button
          type="button"
          onClick={() => execCommand('justifyRight')}
          className="p-2 hover:bg-gray-200 rounded transition-colors"
          title="Align Right"
          disabled={disabled}
        >
          <AlignRight size={16} />
        </button>
      </div>

      <div className="w-px h-6 bg-gray-300 mx-1"></div>

      {/* Insert */}
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={insertLink}
          className="p-2 hover:bg-gray-200 rounded transition-colors"
          title="Insert Link"
          disabled={disabled}
        >
          <Link size={16} />
        </button>
        <button
          type="button"
          onClick={insertImage}
          className="p-2 hover:bg-gray-200 rounded transition-colors"
          title="Insert Image"
          disabled={disabled}
        >
          <Image size={16} />
        </button>
        <button
          type="button"
          onClick={() => execCommand('insertHorizontalRule')}
          className="p-2 hover:bg-gray-200 rounded transition-colors"
          title="Insert Line"
          disabled={disabled}
        >
          <Minus size={16} />
        </button>
        <button
          type="button"
          onClick={() => formatBlock('blockquote')}
          className="p-2 hover:bg-gray-200 rounded transition-colors"
          title="Quote"
          disabled={disabled}
        >
          <Quote size={16} />
        </button>
      </div>

      <div className="w-px h-6 bg-gray-300 mx-1"></div>

      {/* Actions */}
      <div className="flex items-center gap-1 ml-auto">
        <button
          type="button"
          onClick={() => setIsPreview(!isPreview)}
          className={`p-2 rounded transition-colors ${
            isPreview ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-200'
          }`}
          title="Toggle Preview"
          disabled={disabled}
        >
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
          <div 
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: value }}
          />
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
          // Handle paste to prevent formatting issues
          e.preventDefault();
          const text = e.clipboardData.getData('text/plain');
          document.execCommand('insertText', false, text);
        }}
        className="p-4 min-h-[300px] focus:outline-none focus:ring-2 focus:ring-blue-500 prose max-w-none"
        style={{
          minHeight: '300px',
          maxHeight: '500px',
          overflowY: 'auto'
        }}
        data-placeholder="Start writing your blog post..."
        suppressContentEditableWarning={true}
      />
      <style jsx>{`
        [contentEditable=true]:empty:before {
          content: attr(data-placeholder);
          color: #9CA3AF;
          font-style: italic;
        }
        .prose h1 { font-size: 2em; font-weight: bold; margin: 0.5em 0; }
        .prose h2 { font-size: 1.5em; font-weight: bold; margin: 0.5em 0; }
        .prose h3 { font-size: 1.25em; font-weight: bold; margin: 0.5em 0; }
        .prose h4 { font-size: 1.1em; font-weight: bold; margin: 0.5em 0; }
        .prose p { margin: 0.5em 0; }
        .prose ul, .prose ol { margin: 0.5em 0; padding-left: 1.5em; }
        .prose blockquote { 
          border-left: 4px solid #e5e7eb; 
          padding-left: 1em; 
          margin: 1em 0; 
          font-style: italic;
          color: #6b7280;
        }
        .prose hr { margin: 1em 0; border: none; border-top: 1px solid #e5e7eb; }
        .prose a { color: #3b82f6; text-decoration: underline; }
        .prose img { max-width: 100%; height: auto; margin: 0.5em 0; }
      `}</style>
    </div>
  );
};

// Main Add Blog Post Component
const AddBlogPost = () => {
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    category: '',
    status: 'Draft',
    featuredImage: null,
    content: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const categories = [
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
  
  const statuses = ['Draft', 'Published', 'Scheduled'];
  const fileInputRef = useRef(null);

  // Handle input changes
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  // Handle file upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Check file size (2MB limit)
      if (file.size > 2 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          featuredImage: 'File size should be less than 2MB'
        }));
        return;
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({
          ...prev,
          featuredImage: 'Please select a valid image file'
        }));
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData(prev => ({
          ...prev,
          featuredImage: e.target.result
        }));
        setErrors(prev => ({
          ...prev,
          featuredImage: ''
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (!formData.content.trim() || formData.content === '<br>') {
      newErrors.content = 'Content is required';
    }

    if (formData.excerpt && formData.excerpt.length > 200) {
      newErrors.excerpt = 'Excerpt should be less than 200 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Database save function
  const saveBlogs = async (blogData) => {
    try {
      setIsLoading(true);

      // Simulate API call - replace with your actual database save logic
      const response = await fetch('/api/blogs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(blogData),
      });

      if (!response.ok) {
        throw new Error('Failed to save blog post');
      }

      const result = await response.json();
      return result;

    } catch (error) {
      console.error('Error saving blog:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      // Calculate reading time based on HTML content
      const textContent = formData.content.replace(/<[^>]*>/g, '');
      const wordCount = textContent.split(' ').filter(word => word.length > 0).length;
      const readingTime = Math.ceil(wordCount / 200);

      const blogData = {
        ...formData,
        id: Date.now(),
        author: 'Current User',
        date: new Date().toISOString(),
        readTime: readingTime + ' min read',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Save to database
      await saveBlogs(blogData);

      // Success - Reset form
      setFormData({
        title: '',
        excerpt: '',
        category: '',
        status: 'Draft',
        featuredImage: null,
        content: ''
      });

      alert('Blog post saved successfully!');

    } catch (error) {
      alert('Error saving blog post. Please try again.');
    }
  };

  // Handle cancel
  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel? All unsaved changes will be lost.')) {
      setFormData({
        title: '',
        excerpt: '',
        category: '',
        status: 'Draft',
        featuredImage: null,
        content: ''
      });
      setErrors({});
    }
  };

  return (
    <div className=" mx-auto p-6 bg-white rounded-lg shadow-sm">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Create New Blog Post</h1>
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
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.title ? 'border-red-500' : 'border-gray-300'
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
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.excerpt ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="A brief summary of your blog post..."
            disabled={isLoading}
          />
          <div className="flex justify-between items-center mt-1">
            <p className="text-sm text-gray-500">
              A short summary that appears in blog listings (150-200 characters recommended).
            </p>
            <span className="text-sm text-gray-500">
              {formData.excerpt.length}/200
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
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none ${
                  errors.category ? 'border-red-500' : 'border-gray-300'
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
                src={formData.featuredImage} 
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
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-md flex items-center gap-2 transition-colors"
          >
            {isLoading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save size={16} />
                Save Post
              </>
            )}
          </button>
          <button
            onClick={handleCancel}
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

export default AddBlogPost;