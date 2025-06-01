# React Custom Hooks

A collection of reusable React hooks for common functionality in the USTP-Things application.

## Available Hooks

### `useModal`
A hook for managing modal dialogs with support for confirm/cancel actions, keyboard shortcuts, and animations.

```typescript
const { showModal, Modal, isOpen, close, confirm } = useModal();

// Show a confirmation dialog
const handleDelete = async () => {
  const confirmed = await showModal({
    title: 'Confirm Delete',
    content: 'Are you sure you want to delete this item?',
    confirmText: 'Delete',
    cancelText: 'Cancel',
  });
  
  if (confirmed) {
    // Perform delete action
  }
};

// In your JSX
<button onClick={handleDelete}>Delete Item</button>
<Modal />
```

### `useLocalStorage`
A hook for managing localStorage with type safety, expiration, and cross-tab synchronization.

```typescript
const [user, setUser, removeUser] = useLocalStorage<User>('user', {
  id: 1,
  name: 'John Doe',
  email: 'john@example.com',
});

// With options
const [token, setToken] = useLocalStorage({
  key: 'auth_token',
  initialValue: '',
  expiresIn: 1000 * 60 * 60 * 24 * 7, // 7 days
  syncAcrossTabs: true,
});
```

### `useInfiniteScroll`
A hook for implementing infinite scrolling with Intersection Observer.

```typescript
const {
  items,
  loading,
  error,
  hasMore,
  loadMoreRef,
  loadMore,
  reset,
} = useInfiniteScroll(fetchMore, {
  pageSize: 10,
  threshold: 200,
});

// In your JSX
<div className="item-list">
  {items.map(item => (
    <ItemCard key={item.id} item={item} />
  ))}
  {loading && <div>Loading more...</div>}
  <div ref={loadMoreRef} style={{ height: '1px' }} />
</div>
```

### `useDocumentTitle` and `useMetaTags`
Hooks for managing document title and meta tags for SEO.

```typescript
// Set document title
useDocumentTitle('Product Page', {
  prefix: 'My App | ',
  includeSiteName: true,
});

// Set meta tags
useMetaTags([
  { name: 'description', content: 'Product description' },
  { property: 'og:title', content: 'Product Title' },
  { property: 'og:description', content: 'Product description' },
]);
```

### `useKeyboardShortcut`
A hook for adding keyboard shortcuts to your components.

```typescript
// Single key
useKeyboardShortcut('Escape', () => {
  console.log('Escape key pressed');
});

// With modifiers
useKeyboardShortcut(['ctrl+s', 'cmd+s'], (event) => {
  event.preventDefault();
  console.log('Save shortcut pressed');
}, {
  preventDefault: true,
  stopPropagation: true,
});
```

### `useWebSocket`
A hook for managing WebSocket connections with reconnection support.

```typescript
const { isConnected, sendMessage, lastMessage } = useWebSocket('wss://api.example.com/ws', {
  onOpen: () => console.log('Connected'),
  onMessage: (event) => console.log('Message:', event.data),
  onClose: () => console.log('Disconnected'),
  onError: (error) => console.error('Error:', error),
  reconnect: true,
  reconnectInterval: 5000,
  maxReconnectAttempts: 10,
});

// Send a message
sendMessage(JSON.stringify({ type: 'ping' }));
```

## Installation

These hooks are included in the project and can be imported directly:

```typescript
import { useModal, useLocalStorage } from './hooks';
```

## TypeScript Support

All hooks are fully typed with TypeScript and include JSDoc comments for better IDE support.

## Testing

Each hook includes test cases in the `__tests__` directory. Run tests with:

```bash
npm test
```

## Contributing

1. Fork the repository
2. Create a new branch for your feature
3. Add tests for your changes
4. Submit a pull request

## License

MIT
