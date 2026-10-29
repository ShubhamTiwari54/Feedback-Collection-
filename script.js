// EduVerse — beginner-friendly JavaScript
// Features: navigation, course cards, search, course details, star ratings,
// feedback submission, and optional browser storage.

const courses = [
  {
    id: "web",
    title: "Web Development",
    category: "Web Development",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1000&q=80",
    description: "Learn HTML, CSS, JavaScript, and front-end frameworks like React. Build responsive interfaces and practical web projects.",
    modules: 6,
    faculty: ["Prof. Sharma", "Dr. Mehta", "Prof. Singh"],
    learn: ["HTML, CSS and JavaScript", "Responsive web design", "React.js fundamentals", "Build real-world projects"]
  },
  {
    id: "data",
    title: "Data Science",
    category: "Data Science",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1000&q=80",
    description: "Explore Python, data analysis, visualization, and statistics to turn raw data into useful insights.",
    modules: 8,
    faculty: ["Dr. Verma", "Prof. Rao", "Dr. Kapoor"],
    learn: ["Python for data analysis", "Data visualization", "Statistics fundamentals", "Introduction to machine learning"]
  },
  {
    id: "ai",
    title: "AI & Machine Learning",
    category: "AI & Machine Learning",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1000&q=80",
    description: "Understand machine learning concepts, neural networks, and practical AI applications through guided examples.",
    modules: 7,
    faculty: ["Dr. Khan", "Prof. Iyer", "Dr. Das"],
    learn: ["Machine learning concepts", "Model training basics", "Neural network fundamentals", "Responsible AI"]
  },
  {
    id: "cyber",
    title: "Cyber Security",
    category: "Cyber Security",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1000&q=80",
    description: "Learn security fundamentals, encryption, threat awareness, and ways to protect digital systems.",
    modules: 5,
    faculty: ["Prof. Patel", "Dr. Joshi", "Prof. Nair"],
    learn: ["Security fundamentals", "Network threats", "Encryption basics", "Ethical security practices"]
  },
  {
    id: "app",
    title: "App Development",
    category: "App Development",
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=1000&q=80",
    description: "Explore mobile app design and development, from interface planning to core application workflows.",
    modules: 6,
    faculty: ["Prof. Kulkarni", "Dr. Shah", "Prof. Roy"],
    learn: ["Mobile interface fundamentals", "App navigation", "API integration basics", "Testing concepts"]
  },
  {
    id: "uiux",
    title: "UI/UX Design",
    category: "UI/UX Design",
    image: "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?auto=format&fit=crop&w=1000&q=80",
    description: "Learn interface design, wireframing, prototyping, and user experience principles for digital products.",
    modules: 5,
    faculty: ["Ms. Gupta", "Prof. Bose", "Ms. Fernandes"],
    learn: ["User research basics", "Wireframes and prototypes", "Visual hierarchy", "Usability testing"]
  }
];

const STORAGE_KEY = "eduverse-feedback-v1";
let feedback = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
let currentCourse = courses[0];
let selectedCategory = "All";
const ratings = { teaching: 0, content: 0, clarity: 0, overall: 0 };

// Switch between the main pages.
function navigate(page) {
  document.querySelectorAll(".page").forEach(section => {
    section.classList.remove("active");
  });

  const target = document.getElementById("page-" + page);
  if (target) target.classList.add("active");

  document.querySelectorAll(".nav-link").forEach(link => {
    link.classList.toggle("active", link.dataset.page === page);
  });

  document.getElementById("navLinks").classList.remove("open");

  if (page === "courses") showCourses();
  if (page === "feedback") showFeedback();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// Create a course card from course data.
function createCourseCard(course) {
  const reviewCount = feedback.filter(item => item.courseId === course.id).length;

  return `
    <article class="course-card">
      <img class="course-image" src="${course.image}" alt="${course.title}" loading="lazy">
      <div class="course-card-body">
        <span class="course-tag">${course.category}</span>
        <h3>${course.title}</h3>
        <p>${course.description.split(".")[0]}.</p>
        <div class="course-card-foot">
          <span class="meta">▣ ${course.modules} modules · ${reviewCount} reviews</span>
          <button class="text-button" onclick="openCourse('${course.id}')">View details →</button>
        </div>
      </div>
    </article>
  `;
}

// Show courses, optionally filtered by search text and category.
function showCourses(searchText = "") {
  const query = searchText.toLowerCase().trim();

  const filteredCourses = courses.filter(course => {
    const matchesCategory =
      selectedCategory === "All" || course.category === selectedCategory;
    const matchesSearch =
      course.title.toLowerCase().includes(query) ||
      course.description.toLowerCase().includes(query);

    return matchesCategory && matchesSearch;
  });

  document.getElementById("courseCount").textContent =
    `${filteredCourses.length} course${filteredCourses.length === 1 ? "" : "s"}`;

  document.getElementById("courseGrid").innerHTML = filteredCourses.length
    ? filteredCourses.map(createCourseCard).join("")
    : '<div class="empty-state">No courses found. Try another search.</div>';

  document.querySelectorAll("#categoryFilters .pill").forEach(button => {
    button.classList.toggle("active", button.dataset.category === selectedCategory);
  });
}

// Open the selected course and prepare its feedback form.
function openCourse(courseId) {
  currentCourse = courses.find(course => course.id === courseId);
  if (!currentCourse) return;

  document.getElementById("courseInfo").innerHTML = `
    <img class="detail-image" src="${currentCourse.image}" alt="${currentCourse.title}">
    <span class="course-tag">${currentCourse.category}</span>
    <h1 class="detail-title">${currentCourse.title}</h1>
    <p class="detail-description">${currentCourse.description}</p>
    <div class="detail-meta">
      <span class="meta-chip">▣ ${currentCourse.modules} modules</span>
      <span class="meta-chip">♙ ${currentCourse.faculty.length} faculty members</span>
      <span class="meta-chip">◉ Course feedback</span>
    </div>
    <div class="learn-box">
      <h3>Course overview</h3>
      <ul class="learn-list">
        ${currentCourse.learn.map(item => `<li>${item}</li>`).join("")}
      </ul>
    </div>
  `;

  document.getElementById("selectedCourseId").value = currentCourse.id;
  document.getElementById("facultySelect").innerHTML =
    '<option value="">Choose faculty member</option>' +
    currentCourse.faculty.map(name => `<option value="${name}">${name}</option>`).join("");

  document.getElementById("courseFeedbackForm").reset();
  Object.keys(ratings).forEach(key => ratings[key] = 0);
  document.getElementById("formMessage").className = "form-message";
  updateStars();
  navigate("detail");
}

// Make the five stars for each rating category.
function createStars() {
  document.querySelectorAll(".stars").forEach(container => {
    const category = container.dataset.rating;
    container.innerHTML = "";

    for (let value = 1; value <= 5; value++) {
      const star = document.createElement("button");
      star.type = "button";
      star.className = "star";
      star.textContent = "★";
      star.setAttribute("aria-label", value + " stars");
      star.addEventListener("click", () => {
        ratings[category] = value;
        updateStars();
      });
      container.appendChild(star);
    }
  });
}

// Update star colors and rating labels.
function updateStars() {
  Object.keys(ratings).forEach(category => {
    const container = document.querySelector(`.stars[data-rating="${category}"]`);
    const stars = container.querySelectorAll(".star");

    stars.forEach((star, index) => {
      star.classList.toggle("selected", index < ratings[category]);
    });

    document.getElementById(category + "Label").textContent =
      ratings[category] ? `${ratings[category]} / 5` : "Choose 1–5";
  });
}

// Show a message below the feedback form.
function showFormMessage(message, type) {
  const element = document.getElementById("formMessage");
  element.textContent = message;
  element.className = "form-message " + type;
}

// Save submitted feedback in this browser.
document.getElementById("courseFeedbackForm").addEventListener("submit", event => {
  event.preventDefault();

  if (Object.values(ratings).some(value => value === 0)) {
    showFormMessage("Please select a rating for all four categories.", "error");
    return;
  }

  const average =
    Object.values(ratings).reduce((total, value) => total + value, 0) / 4;

  const newFeedback = {
    courseId: currentCourse.id,
    courseTitle: currentCourse.title,
    faculty: document.getElementById("facultySelect").value,
    name: document.getElementById("studentName").value.trim(),
    email: document.getElementById("studentEmail").value.trim(),
    comments: document.getElementById("comments").value.trim(),
    ratings: { ...ratings },
    average: Number(average.toFixed(1)),
    date: new Date().toISOString()
  };

  feedback.unshift(newFeedback);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(feedback));

  showFormMessage("Feedback submitted successfully. Thank you!", "success");
  showCourses();
  showFeedback();

  // Reset ratings after successful submission.
  event.target.reset();
  Object.keys(ratings).forEach(key => ratings[key] = 0);
  updateStars();
});

// Show feedback submitted so far.
function showFeedback() {
  const list = document.getElementById("feedbackList");
  document.getElementById("feedbackCount").textContent =
    `${feedback.length} submission${feedback.length === 1 ? "" : "s"}`;

  if (feedback.length === 0) {
    list.innerHTML = '<div class="empty-state">No feedback submitted yet. Choose a course and share your experience.</div>';
    return;
  }

  list.innerHTML = feedback.slice(0, 20).map(item => `
    <article class="feedback-item">
      <div>
        <h4>${item.courseTitle} <span style="font-weight:500;color:#8a94a5">· ${item.faculty}</span></h4>
        <p>${item.comments || "No written comment provided."}</p>
        <small>${item.name} · ${new Date(item.date).toLocaleDateString()}</small>
      </div>
      <div class="gold-stars">${"★".repeat(Math.round(item.average))}${"☆".repeat(5 - Math.round(item.average))}
        <br><small style="color:#667085">${item.average}/5</small>
      </div>
    </article>
  `).join("");
}

// Navigation links.
document.querySelectorAll(".nav-link").forEach(link => {
  link.addEventListener("click", event => {
    event.preventDefault();
    navigate(link.dataset.page);
  });
});

// Mobile menu button.
document.getElementById("menuToggle").addEventListener("click", () => {
  document.getElementById("navLinks").classList.toggle("open");
});

// Course category buttons.
document.getElementById("categoryFilters").addEventListener("click", event => {
  const button = event.target.closest("[data-category]");
  if (!button) return;

  selectedCategory = button.dataset.category;
  showCourses(document.getElementById("navSearch").value);
});

// Search courses when Enter is pressed.
document.getElementById("navSearch").addEventListener("keydown", event => {
  if (event.key === "Enter") {
    selectedCategory = "All";
    navigate("courses");
    showCourses(event.target.value);
  }
});

// Initialize the website.
document.getElementById("year").textContent = new Date().getFullYear();
createStars();
document.getElementById("homeCourseGrid").innerHTML =
  courses.slice(0, 3).map(createCourseCard).join("");
showCourses();
showFeedback();
