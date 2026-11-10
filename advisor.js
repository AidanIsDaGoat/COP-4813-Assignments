
let courses = [];
const completedCourses = new Set();
const plannedCourses = new Map();

const courseList = document.getElementById("courseList");
const searchInput = document.getElementById("courseSearch");
const filterSelect = document.getElementById("courseFilter");
const semesterSelect = document.getElementById("semesterSelect");

// Load course information from JSON
async function loadCourses() {
    try {
        const response = await fetch("courses.json");

        if (!response.ok) {
            throw new Error("Could not load courses.json");
        }

        const data = await response.json();
        courses = data.courses;

        renderCourses();
        updateSummary();

    } catch (error) {
        courseList.innerHTML =
            "<p>Unable to load course information. Check courses.json.</p>";

        console.error(error);
    }
}

// Check whether a course's prerequisites are satisfied
function checkPrerequisites(course) {
    for (const group of course.prerequisites || []) {

        const completedCount = group.courses.filter(
            id => completedCourses.has(id)
        ).length;

        if (group.type === "AND" &&
            completedCount !== group.courses.length) {
            return false;
        }

        if (group.type === "OR" && completedCount === 0) {
            return false;
        }
    }

    return true;
}

// Explain missing prerequisites
function getMissingPrerequisites(course) {
    const missing = [];

    for (const group of course.prerequisites || []) {

        const completed = group.courses.filter(
            id => completedCourses.has(id)
        );

        if (group.type === "AND" &&
            completed.length !== group.courses.length) {

            const needed = group.courses.filter(
                id => !completedCourses.has(id)
            );

            missing.push("Complete ALL of: " + needed.join(" AND "));
        }

        if (group.type === "OR" && completed.length === 0) {
            missing.push(
                "Complete ONE of: " + group.courses.join(" OR ")
            );
        }
    }

    return missing;
}

// Create a course card dynamically
function createCourseCard(course) {

    const card = document.createElement("article");
    card.className = "course-card";

    const isCompleted = completedCourses.has(course.id);
    const isAvailable = checkPrerequisites(course);

    let status = "Available";

    if (isCompleted) {
        status = "Completed";
        card.classList.add("completed");
    } else if (!isAvailable) {
        status = "Prerequisites Needed";
        card.classList.add("locked");
    } else {
        card.classList.add("available");
    }

    const title = document.createElement("h3");
    title.textContent = course.id + " - " + course.name;

    const statusLabel = document.createElement("span");
    statusLabel.className = "course-status";
    statusLabel.textContent = status;

    const description = document.createElement("p");
    description.textContent = course.description;

    const credits = document.createElement("p");
    credits.textContent = "Credits: " + course.credits;

    const category = document.createElement("p");
    category.textContent = "Category: " + course.category;

    card.append(title, statusLabel, description, credits, category);

    // Display prerequisite information
    if (course.prerequisites && course.prerequisites.length > 0) {

        const prerequisiteText = document.createElement("p");

        prerequisiteText.textContent =
            "Prerequisites: " +
            course.prerequisites.map(group =>
                group.courses.join(" " + group.type + " ")
            ).join(" AND ");

        card.appendChild(prerequisiteText);
    }

    // Display notes stored in JSON
    if (course.notes) {
        const note = document.createElement("div");
        note.className = "course-note";
        note.textContent = course.notes;
        card.appendChild(note);
    }

    // Completed-course checkbox
    const label = document.createElement("label");
    const checkbox = document.createElement("input");

    checkbox.type = "checkbox";
    checkbox.checked = isCompleted;

    checkbox.addEventListener("change", () => {

        if (checkbox.checked) {
            completedCourses.add(course.id);

            // Remove a completed course from the planned courses
            plannedCourses.delete(course.id);

        } else {
            completedCourses.delete(course.id);
        }

        renderCourses();
        renderPlan();
        updateSummary();
        updateAdvisorMessage();
    });

    label.append(checkbox, " Mark as completed");
    card.appendChild(label);

    // Add-to-plan button
    const addButton = document.createElement("button");

    addButton.type = "button";
    addButton.textContent = "Add to Plan";
    addButton.disabled = isCompleted || !isAvailable ||
        plannedCourses.has(course.id);

    addButton.addEventListener("click", () => {
        addToPlan(course.id, semesterSelect.value);
    });

    card.appendChild(addButton);

    // Drag-and-drop support
    if (isAvailable && !isCompleted &&
        !plannedCourses.has(course.id)) {

        card.draggable = true;

        card.addEventListener("dragstart", event => {
            event.dataTransfer.setData("text/plain", course.id);
        });
    }

    return card;
}

// Display courses using JSON data
function renderCourses() {

    courseList.innerHTML = "";

    const search = searchInput.value.toLowerCase();
    const filter = filterSelect.value;

    courses.forEach(course => {

        const isCompleted = completedCourses.has(course.id);
        const isAvailable = checkPrerequisites(course);

        const matchesSearch =
            course.id.toLowerCase().includes(search) ||
            course.name.toLowerCase().includes(search);

        const matchesFilter =
            filter === "all" ||
            (filter === "completed" && isCompleted) ||
            (filter === "available" && !isCompleted && isAvailable) ||
            (filter === "locked" && !isCompleted && !isAvailable);

        if (matchesSearch && matchesFilter) {
            courseList.appendChild(createCourseCard(course));
        }
    });

    if (courseList.children.length === 0) {
        courseList.innerHTML = "<p>No courses match your search.</p>";
    }
}

// Add course to a semester
function addToPlan(courseId, semester) {

    const course = courses.find(c => c.id === courseId);

    if (!course ||
        completedCourses.has(courseId) ||
        !checkPrerequisites(course) ||
        plannedCourses.has(courseId)) {
        return;
    }

    plannedCourses.set(courseId, semester);

    renderCourses();
    renderPlan();
    updateSummary();
    updateAdvisorMessage();
}

// Dynamically create semester plan
function renderPlan() {

    document.querySelectorAll(".semester-box").forEach(box => {

        const semester = box.dataset.semester;
        const dropZone = box.querySelector(".drop-zone");

        dropZone.innerHTML = "";

        let semesterCount = 0;

        plannedCourses.forEach((assignedSemester, courseId) => {

            if (assignedSemester === semester) {

                semesterCount++;

                const course = courses.find(c => c.id === courseId);

                const item = document.createElement("div");
                item.className = "planned-course";

                const title = document.createElement("strong");
                title.textContent = course.id;

                const name = document.createElement("span");
                name.textContent = course.name;

                const credits = document.createElement("p");
                credits.textContent = course.credits + " credits";

                const removeButton = document.createElement("button");
                removeButton.type = "button";
                removeButton.className = "remove-course";
                removeButton.textContent = "Remove";

                removeButton.addEventListener("click", () => {
                    plannedCourses.delete(courseId);
                    renderCourses();
                    renderPlan();
                    updateSummary();
                    updateAdvisorMessage();
                });

                item.append(title, name, credits, removeButton);
                dropZone.appendChild(item);
            }
        });

        if (semesterCount === 0) {
            const empty = document.createElement("p");
            empty.textContent = "Drop courses here";
            dropZone.appendChild(empty);
        }

        const total = document.createElement("p");
        total.textContent = "Courses planned: " + semesterCount;
        dropZone.appendChild(total);
    });
}

// Set up drag-and-drop drop zones
function setupDropZones() {

    document.querySelectorAll(".drop-zone").forEach(zone => {

        zone.addEventListener("dragover", event => {
            event.preventDefault();
            zone.classList.add("drag-over");
        });

        zone.addEventListener("dragleave", () => {
            zone.classList.remove("drag-over");
        });

        zone.addEventListener("drop", event => {
            event.preventDefault();
            zone.classList.remove("drag-over");

            const courseId =
                event.dataTransfer.getData("text/plain");

            const semester =
                zone.closest(".semester-box").dataset.semester;

            addToPlan(courseId, semester);
        });
    });
}

// Update summary numbers
function updateSummary() {

    const available = courses.filter(course =>
        !completedCourses.has(course.id) &&
        checkPrerequisites(course)
    ).length;

    document.getElementById("completedCount").textContent =
        completedCourses.size;

    document.getElementById("availableCount").textContent =
        available;

    document.getElementById("plannedCount").textContent =
        plannedCourses.size;
}

// Explain the student's current options
function updateAdvisorMessage() {

    const available = courses.filter(course =>
        !completedCourses.has(course.id) &&
        checkPrerequisites(course)
    );

    const locked = courses.filter(course =>
        !completedCourses.has(course.id) &&
        !checkPrerequisites(course)
    );

    const message = document.getElementById("advisorMessage");

    message.textContent =
        "You have completed " + completedCourses.size +
        " courses. There are " + available.length +
        " courses currently available and " + locked.length +
        " courses requiring prerequisites. You have " +
        plannedCourses.size + " courses in your semester plan.";
}

// Search and filter events
searchInput.addEventListener("input", renderCourses);
filterSelect.addEventListener("change", renderCourses);

// Clear semester plan
document.getElementById("clearPlan").addEventListener("click", () => {

    plannedCourses.clear();

    renderCourses();
    renderPlan();
    updateSummary();
    updateAdvisorMessage();
});

// Start the advisor
setupDropZones();
loadCourses();
