// Authentication System
let isAdminLoggedIn = false;

// Blog Management System
let articles = [
  {
    id: 1,
    title: "5 Daily Habits for a Cleaner Home",
    category: "Tips & Tricks",
    icon: "fa-lightbulb",
    excerpt:
      "Discover simple daily routines that keep your home consistently clean without overwhelming yourself.",
    content:
      "Maintaining a clean home doesn't have to be overwhelming. By incorporating these five simple habits into your daily routine, you can keep your space tidy with minimal effort.\n\n1. Make Your Bed Every Morning\nStarting your day by making your bed sets a productive tone and instantly makes your bedroom look more put-together.\n\n2. Do a 10-Minute Tidy Before Bed\nSpend just 10 minutes each evening putting items back where they belong. This prevents clutter from accumulating.\n\n3. Clean As You Cook\nWash dishes and wipe counters while cooking rather than leaving everything for later. This makes cleanup much easier.\n\n4. One Load of Laundry Daily\nRather than letting laundry pile up, do one load each day. This prevents the overwhelming weekend laundry marathon.\n\n5. Wipe Down Bathroom Surfaces\nAfter your morning routine, take 30 seconds to wipe down the sink and counter. This prevents buildup and keeps your bathroom fresh.\n\nThese small habits compound over time, creating a consistently clean environment that's easier to maintain. Remember, consistency is more important than perfection!",
    author: "Maria Rodriguez",
    date: "2024-02-15",
  },
  {
    id: 2,
    title: "The Hidden Benefits of a Clean Home",
    category: "Health & Wellness",
    icon: "fa-heart",
    excerpt:
      "Learn how a clean living space positively impacts your mental health, productivity, and overall wellbeing.",
    content:
      "A clean home offers benefits that extend far beyond aesthetics. Research shows that our living environment significantly impacts our mental and physical health.\n\nMental Health Benefits\nClutter and mess can increase stress and anxiety levels. A clean, organized space promotes calmness and mental clarity. Many people report feeling more relaxed and focused in tidy environments.\n\nImproved Productivity\nWhen your space is organized, you spend less time searching for items and more time on meaningful activities. This efficiency boost can improve both work and personal life.\n\nBetter Physical Health\nRegular cleaning removes allergens, dust, and bacteria that can affect respiratory health. This is especially important for those with allergies or asthma.\n\nEnhanced Sleep Quality\nA clean bedroom with fresh sheets and organized spaces promotes better sleep. The psychological comfort of a tidy room helps you relax and unwind.\n\nIncreased Motivation\nLiving in a clean space often motivates people to maintain healthy habits in other areas of life, from exercise to nutrition.\n\nInvesting in a clean home is truly an investment in your overall wellbeing.",
    author: "Dr. Sarah Chen",
    date: "2024-02-10",
  },
  {
    id: 3,
    title: "Eco-Friendly Cleaning: Better for You and the Planet",
    category: "Eco-Friendly",
    icon: "fa-leaf",
    excerpt:
      "Explore natural cleaning alternatives that are safe, effective, and environmentally responsible.",
    content:
      "Switching to eco-friendly cleaning products is easier than you think and offers numerous benefits for your family and the environment.\n\nWhy Choose Eco-Friendly?\nTraditional cleaning products often contain harsh chemicals that can irritate skin, trigger allergies, and harm the environment. Natural alternatives are just as effective without these drawbacks.\n\nSimple Natural Solutions\n\nVinegar and Water: Perfect for glass, countertops, and most surfaces. Mix equal parts in a spray bottle.\n\nBaking Soda: An excellent gentle abrasive for scrubbing sinks, tubs, and tile.\n\nLemon Juice: Natural disinfectant with a fresh scent, great for cutting boards and removing stains.\n\nCastile Soap: Versatile plant-based soap for floors, dishes, and general cleaning.\n\nEssential Oils: Add tea tree or lavender oil for natural antimicrobial properties and pleasant scents.\n\nBenefits You'll Notice\n- Safer for children and pets\n- No harsh chemical odors\n- Cost-effective solutions\n- Reduced plastic waste\n- Healthier indoor air quality\n\nMaking the switch to eco-friendly cleaning is a simple change with lasting positive impacts.",
    author: "Emily Green",
    date: "2024-02-05",
  },
  {
    id: 4,
    title: "Spring Cleaning Checklist: Room by Room Guide",
    category: "Seasonal",
    icon: "fa-calendar-check",
    excerpt:
      "Your comprehensive guide to spring cleaning every room in your home efficiently and thoroughly.",
    content:
      "Spring is the perfect time for a deep, thorough cleaning of your entire home. Follow this room-by-room checklist to ensure nothing gets missed.\n\nKitchen\n☐ Clean inside and behind appliances\n☐ Degrease exhaust fan and range hood\n☐ Wipe down cabinet fronts and organize inside\n☐ Clean and organize refrigerator\n☐ Descale coffee maker and kettle\n☐ Deep clean oven and microwave\n\nBathrooms\n☐ Scrub tile grout and recaulk if needed\n☐ Clean exhaust fans\n☐ Organize medicine cabinet and dispose of expired items\n☐ Wash shower curtains and bath mats\n☐ Deep clean toilet including behind and underneath\n\nBedrooms\n☐ Rotate and flip mattress\n☐ Wash all bedding including comforters and pillows\n☐ Organize closets and donate unused items\n☐ Dust ceiling fans and light fixtures\n☐ Vacuum under bed and furniture\n\nLiving Areas\n☐ Clean windows inside and out\n☐ Dust blinds and wash curtains\n☐ Clean upholstery and carpets\n☐ Wipe baseboards and doors\n☐ Organize entertainment center and cables\n\nBreak these tasks into manageable sections over several weekends for the best results!",
    author: "Maria Rodriguez",
    date: "2024-02-01",
  },
];

let editingId = null;

// Initialize blog on page load
document.addEventListener("DOMContentLoaded", function () {
  renderBlog();
});

function renderBlog() {
  const blogGrid = document.getElementById("blogGrid");

  if (articles.length === 0) {
    blogGrid.innerHTML = `
                    <div class="empty-state">
                        <i class="fas fa-newspaper"></i>
                        <h3>No articles yet</h3>
                        <p>Click "Add New Article" to create your first blog post</p>
                    </div>
                `;
    return;
  }

  blogGrid.innerHTML = articles
    .map(
      (article) => `
                <div class="blog-card">
                    <div class="blog-image">
                        <i class="fas ${article.icon || "fa-newspaper"}"></i>
                    </div>
                    <div class="blog-content">
                        <span class="blog-category">${article.category}</span>
                        <h3>${article.title}</h3>
                        <div class="blog-meta">
                            <i class="fas fa-user"></i> ${article.author || "Admin"} • 
                            <i class="fas fa-calendar"></i> ${formatDate(article.date)}
                        </div>
                        <p class="blog-excerpt">${article.excerpt}</p>
                        <div class="blog-actions">
                            <button class="read-more-btn" onclick="viewArticle(${article.id})">
                                Read More <i class="fas fa-arrow-right"></i>
                            </button>
                            <button class="edit-btn admin-only ${!isAdminLoggedIn ? "hidden" : ""}" onclick="editArticle(${article.id})">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="delete-btn admin-only ${!isAdminLoggedIn ? "hidden" : ""}" onclick="deleteArticle(${article.id})">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `,
    )
    .join("");
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function openArticleModal(id = null) {
  editingId = id;
  const modal = document.getElementById("articleModal");
  const modalTitle = document.getElementById("modalTitle");
  const form = document.getElementById("articleForm");

  if (id) {
    const article = articles.find((a) => a.id === id);
    modalTitle.textContent = "Edit Article";
    document.getElementById("articleId").value = article.id;
    document.getElementById("articleTitle").value = article.title;
    document.getElementById("articleCategory").value = article.category;
    document.getElementById("articleIcon").value = article.icon || "";
    document.getElementById("articleExcerpt").value = article.excerpt;
    document.getElementById("articleContent").value = article.content;
    document.getElementById("articleAuthor").value = article.author || "";
  } else {
    modalTitle.textContent = "Add New Article";
    form.reset();
  }

  modal.classList.add("active");
}

function closeArticleModal() {
  document.getElementById("articleModal").classList.remove("active");
  document.getElementById("articleForm").reset();
  editingId = null;
}

function saveArticle(e) {
  e.preventDefault();

  const articleData = {
    title: document.getElementById("articleTitle").value,
    category: document.getElementById("articleCategory").value,
    icon: document.getElementById("articleIcon").value || "fa-newspaper",
    excerpt: document.getElementById("articleExcerpt").value,
    content: document.getElementById("articleContent").value,
    author: document.getElementById("articleAuthor").value || "Admin",
    date: new Date().toISOString().split("T")[0],
  };

  if (editingId) {
    const index = articles.findIndex((a) => a.id === editingId);
    articles[index] = { ...articles[index], ...articleData };
  } else {
    const newId =
      articles.length > 0 ? Math.max(...articles.map((a) => a.id)) + 1 : 1;
    articles.push({ id: newId, ...articleData });
  }

  renderBlog();
  closeArticleModal();
}

function editArticle(id) {
  openArticleModal(id);
}

function deleteArticle(id) {
  if (confirm("Are you sure you want to delete this article?")) {
    articles = articles.filter((a) => a.id !== id);
    renderBlog();
  }
}

function viewArticle(id) {
  const article = articles.find((a) => a.id === id);
  const viewModal = document.getElementById("viewModal");
  const articleView = document.getElementById("articleView");

  articleView.innerHTML = `
                <h1>${article.title}</h1>
                <div class="meta">
                    <span class="blog-category">${article.category}</span><br>
                    <i class="fas fa-user"></i> ${article.author || "Admin"} • 
                    <i class="fas fa-calendar"></i> ${formatDate(article.date)}
                </div>
                <div class="content">
                    ${article.content
                      .split("\n\n")
                      .map((p) => `<p>${p}</p>`)
                      .join("")}
                </div>
            `;

  viewModal.classList.add("active");
}

function closeViewModal() {
  document.getElementById("viewModal").classList.remove("active");
}

// Admin Authentication Functions
function openLoginModal() {
  document.getElementById("loginModal").classList.add("active");
}

function closeLoginModal() {
  document.getElementById("loginModal").classList.remove("active");
  document.getElementById("adminUsername").value = "";
  document.getElementById("adminPassword").value = "";
}

function handleLogin(e) {
  e.preventDefault();

  const username = document.getElementById("adminUsername").value;
  const password = document.getElementById("adminPassword").value;

  // Simple authentication (in production, this should be server-side)
  if (username === "admin" && password === "maria2024") {
    isAdminLoggedIn = true;
    updateAdminUI();
    closeLoginModal();
    alert("Welcome, Admin! You can now add, edit, and delete articles.");
  } else {
    alert("Invalid username or password. Please try again.");
  }
}

function logout() {
  if (confirm("Are you sure you want to logout?")) {
    isAdminLoggedIn = false;
    updateAdminUI();
    alert("You have been logged out.");
  }
}

function updateAdminUI() {
  const adminElements = document.querySelectorAll(".admin-only");
  const loginBtn = document.querySelector(".admin-login-btn");

  adminElements.forEach((element) => {
    if (isAdminLoggedIn) {
      element.classList.remove("hidden");
    } else {
      element.classList.add("hidden");
    }
  });

  // Hide/show login button
  if (isAdminLoggedIn) {
    loginBtn.classList.add("hidden");
  } else {
    loginBtn.classList.remove("hidden");
  }

  // Re-render blog to update edit/delete buttons
  renderBlog();
}

// Navigation
function showSection(sectionId) {
  document.querySelectorAll(".page-section").forEach((section) => {
    section.classList.remove("active");
  });
  document.getElementById(sectionId).classList.add("active");
  window.scrollTo(0, 0);

  if (window.innerWidth <= 768) {
    document.getElementById("navLinks").classList.remove("active");
  }
}

function toggleMenu() {
  document.getElementById("navLinks").classList.toggle("active");
}

// Close modals on outside click
window.onclick = function (event) {
  const articleModal = document.getElementById("articleModal");
  const viewModal = document.getElementById("viewModal");
  const loginModal = document.getElementById("loginModal");

  if (event.target === articleModal) {
    closeArticleModal();
  }
  if (event.target === viewModal) {
    closeViewModal();
  }
  if (event.target === loginModal) {
    closeLoginModal();
  }
};
