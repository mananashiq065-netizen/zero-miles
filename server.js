const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data', 'menu.json');
const UPLOADS_DIR = path.join(__dirname, 'public', 'uploads');

// ── Ensure required directories exist ───────────────────────────────────────
[path.join(__dirname, 'data'), UPLOADS_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// ── Middleware ───────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ── File upload (images) ─────────────────────────────────────────────────────
const storage = multer.diskStorage({
  destination: UPLOADS_DIR,
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e6)}`;
    cb(null, unique + path.extname(file.originalname));
  }
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Only image files are allowed'), false);
  }
});

// ── Helpers ──────────────────────────────────────────────────────────────────
function loadMenu() {
  if (!fs.existsSync(DATA_FILE)) {
    const seed = getSeedData();
    fs.writeFileSync(DATA_FILE, JSON.stringify(seed, null, 2));
    return seed;
  }
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
}

function saveMenu(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

function getSeedData() {
  return {
    categories: ['Starters', 'Pizza', 'Biryani', 'Chicken Dishes', 'Beverages'],
    items: [
      { id: '1', name: 'Chicken Tikka', category: 'Starters', description: 'Tender chicken marinated in spiced yogurt, grilled to smoky perfection', price: 280, image: '', available: true, badge: 'Chef\'s Pick' },
      { id: '2', name: 'Seekh Kebab', category: 'Starters', description: 'Minced chicken skewers with herbs, cooked over charcoal', price: 300, image: '', available: true, badge: 'Bestseller' },
      { id: '3', name: 'Paneer Tikka', category: 'Starters', description: 'Cottage cheese cubes in tangy marinade, chargrilled with peppers', price: 240, image: '', available: true, badge: '' },
      { id: '4', name: 'Mushroom Tikka', category: 'Starters', description: 'Marinated button mushrooms grilled with onion and capsicum', price: 210, image: '', available: true, badge: 'Veg' },
      { id: '5', name: 'Chicken BBQ Pizza', category: 'Pizza', description: 'Smoky BBQ chicken, mozzarella, caramelised onion on hand-tossed crust', price: 360, image: '', available: true, badge: 'Bestseller' },
      { id: '6', name: 'Margherita Pizza', category: 'Pizza', description: 'Classic tomato base, fresh mozzarella, Italian herbs, olive oil drizzle', price: 250, image: '', available: true, badge: '' },
      { id: '7', name: 'Spicy Chicken Pizza', category: 'Pizza', description: 'Fiery chicken topping, jalapeños, red onion, mozzarella cheese', price: 380, image: '', available: true, badge: 'Spicy 🌶' },
      { id: '8', name: 'Veggie Supreme', category: 'Pizza', description: 'Bell peppers, olives, mushrooms, sweet corn on rich tomato sauce', price: 280, image: '', available: true, badge: 'Veg' },
      { id: '9', name: 'Zero Miles Special Biryani', category: 'Biryani', description: 'Signature dum biryani with whole spices, saffron & tender chicken pieces', price: 350, image: '', available: true, badge: 'Signature' },
      { id: '10', name: 'Chicken Biryani', category: 'Biryani', description: 'Fragrant basmati rice slow-cooked with spiced chicken in a sealed handi', price: 280, image: '', available: true, badge: 'Bestseller' },
      { id: '11', name: 'Mutton Biryani', category: 'Biryani', description: 'Slow-cooked tender mutton with aromatic rice and caramelised onions', price: 380, image: '', available: true, badge: '' },
      { id: '12', name: 'Veg Biryani', category: 'Biryani', description: 'Seasonal vegetables and dry fruits in saffron-infused basmati', price: 220, image: '', available: true, badge: 'Veg' },
      { id: '13', name: 'Butter Chicken', category: 'Chicken Dishes', description: 'Grilled chicken in velvety tomato-butter sauce, finished with cream', price: 320, image: '', available: true, badge: 'Bestseller' },
      { id: '14', name: 'Chicken Karahi', category: 'Chicken Dishes', description: 'Wok-tossed chicken with tomatoes, green chilli, ginger – cooked fresh', price: 350, image: '', available: true, badge: 'Chef\'s Pick' },
      { id: '15', name: 'Chicken Handi', category: 'Chicken Dishes', description: 'Slow-cooked in a clay pot with whole spices and creamy gravy', price: 360, image: '', available: true, badge: '' },
      { id: '16', name: 'Chicken Manchurian', category: 'Chicken Dishes', description: 'Crispy chicken balls in Indo-Chinese sauce with spring onions', price: 300, image: '', available: true, badge: '' },
      { id: '17', name: 'Kashmiri Kahwa', category: 'Beverages', description: 'Traditional green tea with saffron, cardamom, cinnamon and dry fruits', price: 100, image: '', available: true, badge: 'Local Fav' },
      { id: '18', name: 'Mango Shake', category: 'Beverages', description: 'Thick fresh mango blended with chilled milk and a hint of cardamom', price: 120, image: '', available: true, badge: '' },
      { id: '19', name: 'Cold Coffee', category: 'Beverages', description: 'Rich coffee blended with ice cream and chilled milk, topped with cream', price: 140, image: '', available: true, badge: '' },
      { id: '20', name: 'Fresh Lime Soda', category: 'Beverages', description: 'Freshly squeezed lime with soda water, choice of sweet or salted', price: 80, image: '', available: true, badge: '' }
    ]
  };
}

// ── Auth ─────────────────────────────────────────────────────────────────────
const ADMIN_USER = process.env.ADMIN_USER || 'admin';
const ADMIN_PASS = process.env.ADMIN_PASS || 'zeromiles2024';

function makeToken(u, p) {
  return Buffer.from(`${u}:${p}`).toString('base64');
}

function requireAuth(req, res, next) {
  const token = req.headers['x-admin-token'];
  if (token && token === makeToken(ADMIN_USER, ADMIN_PASS)) return next();
  res.status(401).json({ error: 'Unauthorized' });
}

// ── Public API ────────────────────────────────────────────────────────────────
app.get('/api/menu', (req, res) => {
  const menu = loadMenu();
  // Only return available items to public
  const publicMenu = {
    categories: menu.categories,
    items: menu.items.filter(i => i.available)
  };
  res.json(publicMenu);
});

app.get('/api/menu/all', requireAuth, (req, res) => {
  res.json(loadMenu()); // Admin gets all items including unavailable
});

// ── Admin: Auth ───────────────────────────────────────────────────────────────
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;
  if (username === ADMIN_USER && password === ADMIN_PASS) {
    res.json({ success: true, token: makeToken(username, password) });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// ── Admin: Menu Items ─────────────────────────────────────────────────────────
app.post('/api/admin/menu/item', requireAuth, (req, res) => {
  const menu = loadMenu();
  const item = {
    id: Date.now().toString(),
    name: req.body.name || 'New Item',
    category: req.body.category || menu.categories[0],
    description: req.body.description || '',
    price: Number(req.body.price) || 0,
    image: req.body.image || '',
    badge: req.body.badge || '',
    available: true
  };
  menu.items.push(item);
  saveMenu(menu);
  res.json(item);
});

app.put('/api/admin/menu/item/:id', requireAuth, (req, res) => {
  const menu = loadMenu();
  const idx = menu.items.findIndex(i => i.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Item not found' });
  menu.items[idx] = { ...menu.items[idx], ...req.body, id: req.params.id };
  saveMenu(menu);
  res.json(menu.items[idx]);
});

app.delete('/api/admin/menu/item/:id', requireAuth, (req, res) => {
  const menu = loadMenu();
  const before = menu.items.length;
  menu.items = menu.items.filter(i => i.id !== req.params.id);
  if (menu.items.length === before) return res.status(404).json({ error: 'Item not found' });
  saveMenu(menu);
  res.json({ success: true });
});

// Toggle availability
app.patch('/api/admin/menu/item/:id/toggle', requireAuth, (req, res) => {
  const menu = loadMenu();
  const item = menu.items.find(i => i.id === req.params.id);
  if (!item) return res.status(404).json({ error: 'Item not found' });
  item.available = !item.available;
  saveMenu(menu);
  res.json(item);
});

// ── Admin: Categories ─────────────────────────────────────────────────────────
app.post('/api/admin/menu/category', requireAuth, (req, res) => {
  const menu = loadMenu();
  const { category } = req.body;
  if (!category) return res.status(400).json({ error: 'Category name required' });
  if (!menu.categories.includes(category)) {
    menu.categories.push(category);
    saveMenu(menu);
  }
  res.json(menu.categories);
});

app.delete('/api/admin/menu/category', requireAuth, (req, res) => {
  const { category } = req.body;
  const menu = loadMenu();
  menu.categories = menu.categories.filter(c => c !== category);
  // Remove items in deleted category too
  menu.items = menu.items.filter(i => i.category !== category);
  saveMenu(menu);
  res.json(menu.categories);
});

// ── Admin: Image Upload ───────────────────────────────────────────────────────
app.post('/api/admin/upload', requireAuth, upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No image uploaded' });
  res.json({ url: `/uploads/${req.file.filename}` });
});

// ── Catch-all: serve admin panel for /admin routes ────────────────────────────
app.get('/admin*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin', 'index.html'));
});

// ── Start ─────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log('\n🍽️  Zero Miles Grill & Cafe — Direct Ordering System');
  console.log('━'.repeat(50));
  console.log(`🌐 Customer Website : http://localhost:${PORT}`);
  console.log(`🔧 Admin Panel      : http://localhost:${PORT}/admin`);
  console.log(`📡 API Base         : http://localhost:${PORT}/api`);
  console.log('━'.repeat(50));
  console.log(`🔑 Admin Login      : ${ADMIN_USER} / ${ADMIN_PASS}`);
  console.log('   ⚠️  Change these in production via env vars!\n');
});
