# 🍞 Toast Component

A comprehensive, reusable toast notification system built with vanilla JavaScript. Perfect for demonstrating object-oriented design principles in LLD interviews.

## ✨ Features

### Core Functionality

- **Multiple Toast Types**: Success, Error, Warning, Info with distinct visual styling
- **Flexible Positioning**: 6 different positions (top/bottom + left/right/center)
- **Auto-dismiss**: Configurable duration with visual progress bar
- **Manual Dismiss**: Close button and click-to-dismiss options
- **Smooth Animations**: Slide-in/out animations with position-specific effects
- **Responsive Design**: Mobile-friendly with adaptive layouts

### Advanced Features

- **Custom Configuration**: Full control over appearance and behavior
- **Multiple Toasts**: Support for displaying multiple toasts simultaneously
- **Persistent Toasts**: Option to disable auto-dismiss
- **Memory Management**: Automatic cleanup of dismissed toasts
- **Accessibility**: Proper focus management and keyboard navigation
- **Dark Mode**: Automatic dark mode support

## 🚀 Quick Start

### Basic Usage

```javascript
import Toast from "./toast.js";

// Initialize toast system
const toast = new Toast();

// Simple success toast
toast.success("Operation completed successfully!");

// Error toast with custom duration
toast.error("Something went wrong!", { duration: 5000 });

// Warning toast in different position
toast.warning("Please check your input", { position: "top-center" });
```

### Advanced Configuration

```javascript
// Custom toast with full configuration
toast.show("Custom message", "info", {
  duration: 4000,
  position: "bottom-left",
  autoDismiss: true,
  showCloseButton: true,
  animation: true,
  clickToDismiss: true,
});
```

## 🏗️ Architecture & Design Decisions

### Class Design

The `Toast` class demonstrates several important OOP principles:

1. **Single Responsibility**: Each method has a clear, focused purpose
2. **Encapsulation**: Internal state and configuration are properly encapsulated
3. **Configuration Management**: Flexible configuration with sensible defaults
4. **Method Chaining**: Convenience methods for common use cases

### Key Design Patterns

#### 1. Configuration Object Pattern

```javascript
const config = {
  duration: 3000,
  position: "top-right",
  autoDismiss: true,
  showCloseButton: true,
  animation: true,
};
```

#### 2. Factory Method Pattern

```javascript
// Convenience methods for different toast types
toast.success(message, config);
toast.error(message, config);
toast.warning(message, config);
toast.info(message, config);
```

#### 3. Observer Pattern (Event Handling)

```javascript
// Event listeners for user interactions
setupEventListeners(toast, config);
```

### Memory Management

- Automatic cleanup of dismissed toasts
- Proper event listener removal
- DOM element cleanup to prevent memory leaks

## 📁 Project Structure

```
src/
├── toast.js          # Core Toast component class
├── toast.css         # Toast-specific styles
├── demo.js           # Demo interface and examples
├── demo.css          # Demo interface styles
├── main.js           # Application entry point
└── style.css         # Base styles
```

## 🎨 Styling & Theming

### Toast Types

- **Success**: Green theme with checkmark icon
- **Error**: Red theme with X icon
- **Warning**: Orange theme with warning icon
- **Info**: Blue theme with info icon

### Positions

- `top-right` (default)
- `top-left`
- `top-center`
- `bottom-right`
- `bottom-left`
- `bottom-center`

### Responsive Design

- Mobile-optimized layouts
- Adaptive sizing for different screen sizes
- Touch-friendly interactions

## 🔧 Configuration Options

| Option            | Type    | Default     | Description                           |
| ----------------- | ------- | ----------- | ------------------------------------- |
| `duration`        | number  | 3000        | Auto-dismiss duration in milliseconds |
| `position`        | string  | 'top-right' | Toast position on screen              |
| `autoDismiss`     | boolean | true        | Whether to auto-dismiss the toast     |
| `showCloseButton` | boolean | true        | Show manual close button              |
| `animation`       | boolean | true        | Enable slide animations               |
| `clickToDismiss`  | boolean | false       | Allow clicking toast to dismiss       |

## 🧪 Demo Features

The demo interface showcases:

1. **Quick Actions**: One-click toast examples for each type
2. **Custom Configuration**: Interactive form to test all options
3. **Advanced Features**: Multiple toasts, persistent toasts, long messages
4. **Code Examples**: Real usage examples with syntax highlighting
5. **Responsive Testing**: Mobile-friendly interface

## 🚀 Running the Demo

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 🎯 LLD Interview Points

### Object-Oriented Design

- **Class Structure**: Well-organized with clear separation of concerns
- **Inheritance**: Could be extended for different toast variants
- **Polymorphism**: Different toast types with consistent interface
- **Encapsulation**: Internal state management and configuration

### Design Patterns

- **Singleton**: Toast container management
- **Factory**: Toast creation with different types
- **Observer**: Event handling and user interactions
- **Strategy**: Different positioning and animation strategies

### Code Quality

- **Documentation**: Comprehensive JSDoc comments
- **Error Handling**: Graceful fallbacks and validation
- **Performance**: Efficient DOM manipulation and cleanup
- **Accessibility**: Proper ARIA attributes and keyboard navigation

### Scalability

- **Modular Design**: Easy to extend with new features
- **Configuration**: Flexible without breaking changes
- **Memory Management**: Proper cleanup prevents leaks
- **Performance**: Optimized for multiple toasts

## 🔮 Future Enhancements

1. **Queue Management**: Handle toast overflow gracefully
2. **Custom Themes**: User-defined color schemes
3. **Rich Content**: Support for HTML content and images
4. **Animation Library**: More sophisticated animations
5. **Global Configuration**: App-wide toast settings
6. **TypeScript**: Type safety and better IDE support

## 📝 License

MIT License - feel free to use this component in your projects!
