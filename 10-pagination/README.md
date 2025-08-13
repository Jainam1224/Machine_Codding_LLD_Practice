# Product Pagination Demo

A clean, modern pagination implementation built with vanilla JavaScript and Vite. Perfect for LLD (Low Level Design) machine coding interviews.

## 🚀 Features

- **Responsive Product Grid**: Displays 10 products per page in a beautiful grid layout
- **Smart Pagination**: Shows current page, previous/next buttons, and page numbers with ellipsis for large datasets
- **Modern UI**: Clean design with hover effects and smooth transitions
- **Mobile Responsive**: Works perfectly on all device sizes
- **Fast Performance**: Lightweight vanilla JS implementation

## 🛠️ Technical Implementation

### Core Components

1. **PaginationApp Class**: Main application logic

     - Manages current page state
     - Handles page navigation
     - Renders products and pagination controls
     - Fetches data from external API

2. **API Integration**: Real data from JSONPlaceholder API

     - Fetches posts and transforms them to products
     - Uses Picsum for placeholder images
     - Handles loading and error states
     - Retry functionality for failed requests

3. **Pagination Logic**:
   - 10 items per page
   - Smart page number display (shows current ±1, first, last, and ellipsis)
   - Previous/Next navigation
   - Disabled states for edge cases

### Key Methods

- `getCurrentPageProducts()`: Returns products for current page
- `goToPage(page)`: Navigate to specific page
- `renderProducts()`: Renders product grid
- `renderPagination()`: Renders pagination controls

## 🎯 Interview Demonstration Points

### 1. **Code Structure** (5 minutes)

- Show the class-based architecture
- Explain separation of concerns
- Highlight clean, readable code

### 2. **Pagination Logic** (10 minutes)

- Walk through the pagination algorithm
- Show how page numbers are calculated
- Demonstrate edge case handling

### 3. **UI/UX Features** (5 minutes)

- Show responsive design
- Demonstrate hover effects
- Test on different screen sizes

### 4. **Performance & Scalability** (5 minutes)

- Explain how it would scale with API integration
- Discuss memory efficiency
- Show how to add features like search/filter

### 5. **Live Demo** (10 minutes)

- Navigate through pages
- Show mobile responsiveness
- Demonstrate smooth interactions

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:5173
```

## 📱 Responsive Design

- **Desktop**: 4-5 products per row
- **Tablet**: 2-3 products per row
- **Mobile**: 1 product per row
- **Pagination**: Adapts to screen size

## 🔧 Customization

### Change Items Per Page

```javascript
this.itemsPerPage = 10; // Change this value
```

### Add More Products

```javascript
const products = [
  // Add more product objects here
];
```

### Modify Styling

Edit `src/style.css` to customize colors, spacing, and animations.

## 🎨 Design Highlights

- **Gradient Background**: Modern purple gradient
- **Card Design**: Clean white cards with shadows
- **Hover Effects**: Smooth lift animation on product cards
- **Button States**: Active, hover, and disabled states
- **Typography**: System fonts for optimal readability

## 📊 Data Structure

```javascript
const product = {
  id: number,
  title: string,
  image: string(URL),
};
```

## 🔮 Future Enhancements

- API integration with real product data
- Search and filter functionality
- Sorting options
- Product details modal
- Loading states
- Error handling

## 💡 Interview Tips

1. **Start with Requirements**: Clarify pagination rules (items per page, navigation style)
2. **Show Architecture**: Explain class structure and method responsibilities
3. **Demonstrate Logic**: Walk through pagination calculations
4. **Test Edge Cases**: Show first/last page handling
5. **Discuss Scalability**: How would you handle 1000+ products?
6. **Mobile First**: Emphasize responsive design importance

## 🎯 Success Metrics

- ✅ Clean, maintainable code
- ✅ Responsive design
- ✅ Smooth user experience
- ✅ Proper error handling
- ✅ Scalable architecture
- ✅ Interview-ready presentation

---

**Built with ❤️ for LLD Machine Coding Interviews**
