import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  Calendar, 
  User, 
  ArrowLeft, 
  Share2, 
  BookOpen,
  Tag,
  
} from "lucide-react";
import { Button } from "../ui/button";
import { getBlogById } from "../../services/blogService";
import Navbar from "../pages/navbar";
import Footer from "../pages/footer";
import { toast } from "react-toastify";
export default function BlogDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      fetchBlogDetail();
    }
  }, [id]);

  const fetchBlogDetail = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await getBlogById(id);
      setBlog(response);
    } catch (error) {
      console.error('Error fetching blog detail:', error);
      setError('Failed to load blog post. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: blog.title,
          text: blog.excerpt,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy URL to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast.success('Blog URL copied to clipboard!');
    }
  };

  const goBackToBlogs = () => {
    navigate('/blog');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="animate-pulse">
            {/* Back button skeleton */}
            
            {/* Title skeleton */}
            <div className="bg-gray-200 h-12 w-3/4 rounded-lg mb-4"></div>
            
            {/* Meta info skeleton */}
            <div className="flex gap-6 mb-8">
              <div className="bg-gray-200 h-6 w-32 rounded"></div>
              <div className="bg-gray-200 h-6 w-24 rounded"></div>
            </div>
            
            {/* Image skeleton */}
            <div className="bg-gray-200 h-64 md:h-96 w-full rounded-xl mb-8"></div>
            
            {/* Content skeleton */}
            <div className="space-y-4">
              {[...Array(8)].map((_, index) => (
                <div key={index} className="bg-gray-200 h-4 rounded w-full"></div>
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center py-20">
            <div className="text-red-400 mb-4">
              <BookOpen className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">Error Loading Article</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <div className="flex gap-4 justify-center">
              <Button 
                onClick={fetchBlogDetail}
                className="bg-primarysolid text-white hover:bg-blue-600"
              >
                Try Again
              </Button>
              <Button 
                variant="outline"
                onClick={goBackToBlogs}
              >
                Back to Blog
              </Button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center py-20">
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">Blog post not found</h3>
            <p className="text-gray-600 mb-4">The article you're looking for doesn't exist or has been removed.</p>
            <Button 
              onClick={goBackToBlogs}
              className="bg-primarysolid text-white hover:bg-blue-600"
            >
              Back to Blog
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={goBackToBlogs}
          className="mb-8 text-primarysolid hover:text-primarysolid/80 hover:bg-blue-50"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Blog
        </Button>

        {/* Article Header */}
        <article className="rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-8 md:p-12">
            {/* Breadcrumb */}
           

            {/* Title */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              {blog.title}
            </h1>

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-8">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                <span>{formatDate(blog.publishedAt)}</span>
              </div>
              
          

              {blog.author && (
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  <span>{blog.author}</span>
                </div>
              )}

              <Button
                variant="ghost"
                onClick={handleShare}
                className="text-gray-600 hover:text-primarysolid hover:bg-blue-50 p-2"
              >
                <Share2 className="w-5 h-5" />
              </Button>
            </div>

            {/* Featured Image */}
            {blog.featuredImage && (
              <div className="mb-8 rounded-xl overflow-hidden">
                <img
                  src={`${import.meta.env.VITE_APP_BASE_URL}${blog.featuredImage}`}
                  alt={blog.title}
                  className="w-full h-64 md:h-96 object-cover"
                  onError={(e) => {
                    e.target.src = '/api/placeholder/800/400';
                  }}
                />
              </div>
            )}

            {/* Excerpt */}
            {blog.excerpt && (
              <div className="border-l-4 border-primarysolid p-6 mb-8 rounded-r-lg bg-gray-50">
                <p className="text-lg text-gray-700 italic leading-relaxed">
                  {blog.excerpt}
                </p>
              </div>
            )}

            {/* Blog Content */}
            <div className="prose prose-lg max-w-none">
              {blog.content ? (
                <div 
                  className="text-gray-800 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: blog.content }}
                />
              ) : (
                <div className="text-gray-600 text-center py-8">
                  <p>Content not available</p>
                </div>
              )}
            </div>

            {/* Tags */}
            {blog.tags && blog.tags.length > 0 && (
              <div className="mt-12 pt-8 border-t border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                  <Tag className="w-5 h-5 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">Tags:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {blog.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-gray-100 text-primarysolid px-3 py-1 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </article>

        {/* Back to Blog CTA */}
        <div className="text-center mt-12">
          <Button
            onClick={goBackToBlogs}
            className="bg-primarysolid text-white hover:bg-blue-600 px-8 py-3"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Read More Articles
          </Button>
        </div>
      </main>

      <Footer />
    </div>
  );
}