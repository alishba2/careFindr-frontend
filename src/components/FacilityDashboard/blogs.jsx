import { useState, useEffect } from "react";
import { Calendar, Clock, User, Search, ChevronRight, Filter, X, RotateCcw } from "lucide-react";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";

import { getPublishedBlogs } from "../../services/blogService";
import Navbar from "../pages/navbar";
import Footer from "../pages/footer";

export default function BlogPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalBlogs, setTotalBlogs] = useState(0);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [categories] = useState([
    "All Categories",
    "Health & Wellness",
    "Women's Health", 
    "Child & Family Health",
    "Emergency Care Tips",
    "Chronic Illness Management",
    "Digital Health Literacy",
    "Product Update",
    "General"
  ]);
  
  const navigate = useNavigate();

  useEffect(() => {
    fetchBlogs();
  }, [currentPage, searchQuery, selectedCategory]);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = {
        page: currentPage,
        limit: 9,
        search: searchQuery,
        category: selectedCategory !== "All Categories" ? selectedCategory : undefined
      };

      const response = await getPublishedBlogs(params);
      
      setBlogs(response.blogs || []);
      setTotalPages(response.totalPages || 1);
      setTotalBlogs(response.totalBlogs || 0);
    } catch (error) {
      console.error('Error fetching blogs:', error);
      setError('Failed to load blogs. Please try again later.');
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setCurrentPage(1); // Reset to first page when filtering
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All Categories");
    setCurrentPage(1);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleBlogClick = (blog) => {
    navigate(`/blog/${blog._id}`);
  };

  const BlogCard = ({ blog }) => (
    <article 
      className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 group cursor-pointer"
      onClick={() => handleBlogClick(blog)}
    >
      <div className="relative overflow-hidden">
        <img
          src={`${import.meta.env.VITE_APP_BASE_URL}${blog.featuredImage}`}
          alt={blog.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.target.src = '/api/placeholder/600/400';
          }}
        />
      </div>
      
      <div className="p-6">
        <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(blog.publishedAt)}</span>
          </div>
        </div>
        
        <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-primarysolid transition-colors">
          {blog.title}
        </h2>
        
        <p className="text-gray-600 mb-4 line-clamp-3">
          {blog.excerpt || 'Click to read more...'}
        </p>
        
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            className="text-primarysolid hover:text-primarysolid/80 p-0 h-auto font-medium"
            onClick={(e) => {
              e.stopPropagation();
              handleBlogClick(blog);
            }}
          >
            Read More
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
        
        {blog.tags && blog.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {blog.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </article>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-primarysolid text-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Your Guide to Smarter, Connected Healthcare
            </h1>
            <p className="text-base md:text-lg text-blue-100 max-w-2xl mx-auto">
              From finding the right care to understanding your health—our blog delivers trusted tips, expert insights, and updates that help you make confident healthcare decisions with CareFindr
            </p>
          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-8 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search blog posts..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primarysolid focus:border-transparent outline-none transition-all"
              />
            </div>

            {/* Category Filter and Actions */}
            <div className="flex items-center gap-3">
              <select
                value={selectedCategory}
                onChange={handleCategoryChange}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primarysolid focus:border-transparent outline-none bg-white min-w-[180px]"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>

              {/* Clear Filters Button */}
              {(searchQuery || selectedCategory !== "All Categories") && (
                <Button
                  variant="outline"
                  onClick={clearFilters}
                  className="flex items-center gap-2 px-4 py-3"
                >
                  <Filter className="w-4 h-4" />
                  Clear
                </Button>
              )}

              {/* Refresh Button */}
              <Button
                variant="outline"
                onClick={fetchBlogs}
                className="p-3"
                disabled={loading}
              >
                <RotateCcw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </div>

          {/* Filter Status */}
          {(searchQuery || selectedCategory !== "All Categories") && (
            <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
              <span>Active filters:</span>
              {searchQuery && (
                <span className="bg-blue-100 text-primarysolid px-2 py-1 rounded-full text-xs">
                  Search: "{searchQuery}"
                </span>
              )}
              {selectedCategory !== "All Categories" && (
                <span className="bg-blue-100 text-primarysolid px-2 py-1 rounded-full text-xs">
                  Category: {selectedCategory}
                </span>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Blog Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Results Counter */}
          <div className="mb-8">
            <p className="text-gray-600">
              {loading ? 'Loading...' : `Showing ${blogs.length} of ${totalBlogs} articles`}
            </p>
          </div>

          {error ? (
            <div className="text-center py-20">
              <div className="text-red-400 mb-4">
                <Search className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">Error Loading Articles</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <Button 
                onClick={fetchBlogs}
                className="bg-primarysolid text-white hover:bg-blue-600"
              >
                Try Again
              </Button>
            </div>
          ) : loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="bg-gray-200 h-48 rounded-xl mb-4"></div>
                  <div className="space-y-3">
                    <div className="bg-gray-200 h-4 rounded w-3/4"></div>
                    <div className="bg-gray-200 h-4 rounded w-1/2"></div>
                    <div className="bg-gray-200 h-4 rounded w-full"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : blogs.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-gray-400 mb-4">
                <Search className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                {searchQuery || selectedCategory !== "All Categories" 
                  ? "No articles match your filters" 
                  : "No articles found"
                }
              </h3>
              <p className="text-gray-600 mb-4">
                {searchQuery || selectedCategory !== "All Categories"
                  ? "Try adjusting your search or filter criteria"
                  : "Check back later for new content"
                }
              </p>
              {(searchQuery || selectedCategory !== "All Categories") && (
                <Button 
                  onClick={clearFilters}
                  variant="outline"
                  className="mt-4"
                >
                  Clear Filters
                </Button>
              )}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {blogs.map((blog) => (
                  <BlogCard key={blog._id} blog={blog} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-16">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2"
                    >
                      Previous
                    </Button>
                    
                    {[...Array(totalPages)].map((_, index) => (
                      <Button
                        key={index + 1}
                        variant={currentPage === index + 1 ? "default" : "outline"}
                        onClick={() => setCurrentPage(index + 1)}
                        className={`px-4 py-2 ${
                          currentPage === index + 1 
                            ? 'bg-primarysolid text-white' 
                            : ''
                        }`}
                      >
                        {index + 1}
                      </Button>
                    ))}
                    
                    <Button
                      variant="outline"
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2"
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}