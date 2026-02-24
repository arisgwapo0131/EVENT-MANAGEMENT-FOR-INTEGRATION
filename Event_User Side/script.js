// Event Hub - Student Side Event Management System

// Data Storage
const eventHubData = {
    events: [],
    registrations: [],
    announcements: [],
    feedback: [],
    currentUser: {
        id: 'user_' + Math.random().toString(36).substr(2, 9),
        firstName: 'John',
        lastName: 'Student',
        email: 'john.student@university.edu',
        department: 'Computer Science'
    }
};

// Load data from localStorage
function loadData() {
    const saved = localStorage.getItem('eventHubData');
    if (saved) {
        Object.assign(eventHubData, JSON.parse(saved));
    } else {
        initializeSampleData();
    }
}

// Save data
function saveData() {
    localStorage.setItem('eventHubData', JSON.stringify(eventHubData));
}

// Initialize sample data
function initializeSampleData() {
    eventHubData.events = [
        {
            id: 'evt_001',
            title: 'Annual Tech Summit 2026',
            description: 'A comprehensive summit featuring the latest trends in technology, AI, and web development.',
            date: '2026-03-15',
            time: '09:00 AM',
            endTime: '05:00 PM',
            location: 'Main Auditorium',
            category: 'academic',
            capacity: 500,
            registered: 245,
            image: '',
            status: 'upcoming',
            details: 'Join us for an exciting day of learning and networking with industry experts.'
        },
        {
            id: 'evt_002',
            title: 'Campus Fun Run',
            description: 'A 5K fun run around campus to promote fitness and wellness.',
            date: '2026-03-22',
            time: '06:00 AM',
            endTime: '08:00 AM',
            location: 'Campus Grounds',
            category: 'sports',
            capacity: 200,
            registered: 120,
            image: '',
            status: 'upcoming',
            details: 'Bring your friends and join us for a healthy and fun morning.'
        },
        {
            id: 'evt_003',
            title: 'Cultural Night Celebration',
            description: 'Celebrate diversity with cultural performances from around the world.',
            date: '2026-03-20',
            time: '07:00 PM',
            endTime: '10:00 PM',
            location: 'Gymnasium',
            category: 'cultural',
            capacity: 300,
            registered: 150,
            image: '',
            status: 'upcoming',
            details: 'Experience music, dance, and cuisine from different cultures.'
        },
        {
            id: 'evt_004',
            title: 'Web Development Workshop',
            description: 'Learn the latest web development frameworks and best practices.',
            date: '2026-03-18',
            time: '02:00 PM',
            endTime: '05:00 PM',
            location: 'Computer Lab 2',
            category: 'workshop',
            capacity: 50,
            registered: 48,
            image: '',
            status: 'upcoming',
            details: 'Hands-on workshop with live coding sessions.'
        },
        {
            id: 'evt_005',
            title: 'Student Social Meet & Greet',
            description: 'A casual meetup for students to network and make new friends.',
            date: '2026-03-25',
            time: '06:00 PM',
            endTime: '08:00 PM',
            location: 'Student Center',
            category: 'social',
            capacity: 100,
            registered: 65,
            image: '',
            status: 'upcoming',
            details: 'Free snacks and refreshments will be provided.'
        }
    ];

    eventHubData.announcements = [
        {
            id: 'ann_001',
            title: 'Registration Open for Tech Summit',
            message: 'Limited seats available! Register now for the Annual Tech Summit on March 15th.',
            date: new Date().toISOString().split('T')[0],
            timestamp: new Date().getTime()
        },
        {
            id: 'ann_002',
            title: 'Campus Tour Guide Recruitment',
            message: 'Join our team as a campus tour guide! Send your CV to events@university.edu',
            date: new Date(2026, 1, 18).toISOString().split('T')[0],
            timestamp: new Date().getTime() - 86400000
        },
        {
            id: 'ann_003',
            title: 'Important: Event Policy Update',
            message: 'All registered attendees must check in 15 minutes before the event starts.',
            date: new Date(2026, 1, 15).toISOString().split('T')[0],
            timestamp: new Date().getTime() - (3 * 86400000)
        }
    ];

    saveData();
}

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    loadData();
    updateUserDisplay();
    initializeNavigation();
    initializeTabs();
    initializeModals();
    initializeCalendar();
    initializeForms();
    renderAllSections();
});

// Update user display
function updateUserDisplay() {
    const nameElement = document.getElementById('userDisplayName');
    if (nameElement) {
        nameElement.textContent = eventHubData.currentUser.firstName + ' ' + eventHubData.currentUser.lastName;
    }
}

// Navigation
function initializeNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const sectionId = this.getAttribute('data-section');
            viewSection(sectionId);
        });
    });
}

// View section
function viewSection(sectionId) {
    document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
    document.querySelectorAll('.section').forEach(sec => sec.classList.remove('active'));
    
    document.querySelector('[data-section="' + sectionId + '"]').classList.add('active');
    document.getElementById(sectionId).classList.add('active');
    
    if (sectionId === 'dashboard') renderDashboard();
    else if (sectionId === 'browse-events') renderBrowseEvents();
    else if (sectionId === 'calendar') renderCalendar();
    else if (sectionId === 'my-events') renderMyRegistrations();
    else if (sectionId === 'announcements') renderAnnouncements();
    else if (sectionId === 'feedback') renderFeedback();
}

// Tabs
function initializeTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const tabName = this.getAttribute('data-tab');
            const tabsContainer = this.closest('.tabs-container');
            tabsContainer.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            tabsContainer.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
            this.classList.add('active');
            tabsContainer.querySelector('#' + tabName).classList.add('active');
        });
    });
}

// Modals
function initializeModals() {
    const closeButtons = document.querySelectorAll('.modal-close');
    closeButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            this.closest('.modal').style.display = 'none';
        });
    });
    window.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal')) {
            event.target.style.display = 'none';
        }
    });
}

// Render all
function renderAllSections() {
    renderDashboard();
    renderBrowseEvents();
    renderCalendar();
    renderMyRegistrations();
    renderAnnouncements();
    renderFeedback();
}

// DASHBOARD
function renderDashboard() {
    const upcomingEvents = eventHubData.events.filter(e => e.status === 'upcoming').length;
    const myRegs = eventHubData.registrations.length;
    const newAnnouncements = eventHubData.announcements.length;
    
    document.getElementById('upcomingCount').textContent = upcomingEvents;
    document.getElementById('myRegistrationsCount').textContent = myRegs;
    document.getElementById('announcementsCount').textContent = newAnnouncements;
    
    const upcomingGrid = document.getElementById('upcomingEventsGrid');
    const upcoming = eventHubData.events.filter(e => e.status === 'upcoming').slice(0, 3);
    
    upcomingGrid.innerHTML = upcoming.map(event => `
        <div class="event-card" onclick="showEventModal('${event.id}')">
            <div class="event-card-image">${event.image}</div>
            <div class="event-card-content">
                <h4>${event.title}</h4>
                <p class="event-date">📅 ${formatDate(event.date)}</p>
                <p class="event-time">⏰ ${event.time}</p>
                <p class="event-location">📍 ${event.location}</p>
                <div class="event-card-footer">
                    <span class="event-category">${event.category}</span>
                    <span class="event-spots">${event.capacity - event.registered} spots left</span>
                </div>
            </div>
        </div>
    `).join('');
    
    if (upcoming.length === 0) {
        upcomingGrid.innerHTML = '<p class="empty-state">No upcoming events.</p>';
    }
    
    const announcementsPreview = document.getElementById('announcementsPreview');
    const latestAnn = eventHubData.announcements.slice(0, 3);
    
    announcementsPreview.innerHTML = latestAnn.map(ann => `
        <div class="announcement-item">
            <h4>${ann.title}</h4>
            <p>${ann.message.substring(0, 100)}...</p>
            <small class="announcement-date">${formatDate(ann.date)}</small>
        </div>
    `).join('');
}

// BROWSE EVENTS
function renderBrowseEvents() {
    displayFilteredEvents();
    const searchInput = document.getElementById('eventSearchInput');
    const statusFilter = document.getElementById('eventStatusFilter');
    const categoryFilter = document.getElementById('eventCategoryFilter');
    
    if (searchInput) searchInput.addEventListener('input', displayFilteredEvents);
    if (statusFilter) statusFilter.addEventListener('change', displayFilteredEvents);
    if (categoryFilter) categoryFilter.addEventListener('change', displayFilteredEvents);
}

function displayFilteredEvents() {
    const searchTerm = (document.getElementById('eventSearchInput').value || '').toLowerCase();
    const statusFilter = document.getElementById('eventStatusFilter').value || '';
    const categoryFilter = document.getElementById('eventCategoryFilter').value || '';
    
    let filtered = eventHubData.events.filter(event => {
        const matchesSearch = event.title.toLowerCase().includes(searchTerm) || event.description.toLowerCase().includes(searchTerm);
        const matchesStatus = !statusFilter || event.status === statusFilter;
        const matchesCategory = !categoryFilter || event.category === categoryFilter;
        return matchesSearch && matchesStatus && matchesCategory;
    });
    
    const eventsGrid = document.getElementById('allEventsGrid');
    
    if (filtered.length === 0) {
        eventsGrid.innerHTML = '<p class="empty-state">No events found.</p>';
        return;
    }
    
    eventsGrid.innerHTML = filtered.map(event => {
        const isRegistered = eventHubData.registrations.some(r => r.eventId === event.id);
        return `
            <div class="event-card">
                <div class="event-card-image">${event.image}</div>
                <div class="event-card-content">
                    <h4>${event.title}</h4>
                    <p class="event-description">${event.description}</p>
                    <div class="event-details-mini">
                        <p>📅 ${formatDate(event.date)} at ${event.time}</p>
                        <p>📍 ${event.location}</p>
                        <p>👥 Registered: ${event.registered}/${event.capacity}</p>
                    </div>
                    <div class="event-card-footer">
                        <span class="event-category">${event.category}</span>
                    </div>
                    <div class="event-actions">
                        <button class="btn btn-secondary btn-sm" onclick="showEventModal('${event.id}')">View Details</button>
                        ${!isRegistered ? `<button class="btn btn-primary btn-sm" onclick="openRegistrationModal('${event.id}')">Register</button>` : `<span class="badge badge-success">Registered</span>`}
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function renderMyRegistrations() {
    const registeredEventsGrid = document.getElementById('registeredEventsGrid');
    const registeredEventIds = eventHubData.registrations.filter(r => r.status === 'registered').map(r => r.eventId);
    const registeredEvents = eventHubData.events.filter(e => registeredEventIds.includes(e.id));
    
    if (registeredEvents.length === 0) {
        registeredEventsGrid.innerHTML = '<p class="empty-state">No registrations yet.</p>';
    } else {
        registeredEventsGrid.innerHTML = registeredEvents.map(event => `
            <div class="event-card">
                <div class="event-card-image">${event.image}</div>
                <div class="event-card-content">
                    <h4>${event.title}</h4>
                    <p>📅 ${formatDate(event.date)}</p>
                    <p>⏰ ${event.time}</p>
                    <p>📍 ${event.location}</p>
                    <div class="event-actions">
                        <button class="btn btn-secondary btn-sm" onclick="showEventModal('${event.id}')">View</button>
                        <button class="btn btn-danger btn-sm" onclick="unregisterEvent('${event.id}')">Cancel</button>
                    </div>
                </div>
            </div>
        `).join('');
    }
}

// ANNOUNCEMENTS
function renderAnnouncements() {
    const announcementsList = document.getElementById('allAnnouncementsList');
    if (eventHubData.announcements.length === 0) {
        announcementsList.innerHTML = '<p class="empty-state">No announcements.</p>';
        return;
    }
    announcementsList.innerHTML = eventHubData.announcements.sort((a, b) => b.timestamp - a.timestamp).map(ann => `
        <div class="announcement-card">
            <div class="announcement-header">
                <h3>${ann.title}</h3>
                <span class="announcement-date">${formatDate(ann.date)}</span>
            </div>
            <p class="announcement-message">${ann.message}</p>
        </div>
    `).join('');
}

// FEEDBACK
function renderFeedback() {
    const feedbackSelect = document.getElementById('feedbackEventSelect');
    feedbackSelect.innerHTML = '<option value="">Select an event</option>' + eventHubData.events.map(e => `<option value="${e.id}">${e.title}</option>`).join('');
    const feedbackForm = document.getElementById('feedbackForm');
    if (feedbackForm) feedbackForm.onsubmit = submitFeedback;
    renderFeedbackHistory();
}

function submitFeedback(e) {
    e.preventDefault();
    const eventId = document.getElementById('feedbackEventSelect').value;
    const ratingElement = document.querySelector('input[name="feedbackRating"]:checked');
    const comments = document.getElementById('feedbackComments').value;
    
    if (!eventId) {
        alert('Please select an event');
        return;
    }
    
    if (!ratingElement) {
        alert('Please select a rating');
        return;
    }
    
    if (!comments.trim()) {
        alert('Please enter your feedback comments');
        return;
    }
    
    const feedback = {
        id: 'fb_' + Math.random().toString(36).substr(2, 9),
        eventId: eventId,
        userId: eventHubData.currentUser.id,
        rating: parseInt(ratingElement.value),
        comments: comments,
        date: new Date().toISOString().split('T')[0],
        timestamp: new Date().getTime()
    };
    eventHubData.feedback.push(feedback);
    saveData();
    document.getElementById('feedbackForm').reset();
    alert('Thank you for your feedback!');
    renderFeedbackHistory();
}

function renderFeedbackHistory() {
    const historyList = document.getElementById('feedbackHistoryList');
    const userFeedback = eventHubData.feedback.filter(f => f.userId === eventHubData.currentUser.id);
    if (userFeedback.length === 0) {
        historyList.innerHTML = '<p class="empty-state">No feedback yet.</p>';
        return;
    }
    historyList.innerHTML = userFeedback.sort((a, b) => b.timestamp - a.timestamp).map(fb => {
        const event = eventHubData.events.find(e => e.id === fb.eventId);
        const ratingStars = '⭐'.repeat(fb.rating);
        return `
            <div class="feedback-card">
                <div class="feedback-header">
                    <h4>${event ? event.title : 'Event'}</h4>
                    <span class="rating">${ratingStars}</span>
                </div>
                <p>${fb.comments}</p>
                <small class="feedback-date">${formatDate(fb.date)}</small>
            </div>
        `;
    }).join('');
}

// CALENDAR
function initializeCalendar() {
    renderCalendar();
}

let calendarCurrentDate = new Date();

function renderCalendar() {
    const monthYear = document.getElementById('monthYear');
    const calendarDays = document.getElementById('calendarDays');
    
    if (!monthYear || !calendarDays) return;
    
    const year = calendarCurrentDate.getFullYear();
    const month = calendarCurrentDate.getMonth();
    monthYear.textContent = calendarCurrentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
    
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    calendarDays.innerHTML = '';
    
    for (let i = 0; i < firstDay; i++) {
        const emptyCell = document.createElement('div');
        emptyCell.className = 'calendar-day empty';
        calendarDays.appendChild(emptyCell);
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
        const dayCell = document.createElement('div');
        dayCell.className = 'calendar-day';
        const dateStr = year + '-' + String(month + 1).padStart(2, '0') + '-' + String(day).padStart(2, '0');
        const eventsOnDay = eventHubData.events.filter(e => e.date === dateStr);
        
        if (eventsOnDay.length > 0) {
            dayCell.classList.add('has-events');
            dayCell.innerHTML = '<span>' + day + '</span><span class="event-dots">' + '•'.repeat(eventsOnDay.length) + '</span>';
            dayCell.onclick = () => showCalendarDate(dateStr);
        } else {
            dayCell.textContent = day;
        }
        
        if (dateStr === new Date().toISOString().split('T')[0]) {
            dayCell.classList.add('today');
        }
        calendarDays.appendChild(dayCell);
    }
    
    document.getElementById('prevMonth').onclick = () => {
        calendarCurrentDate.setMonth(calendarCurrentDate.getMonth() - 1);
        renderCalendar();
    };
    document.getElementById('nextMonth').onclick = () => {
        calendarCurrentDate.setMonth(calendarCurrentDate.getMonth() + 1);
        renderCalendar();
    };
    showCalendarDate(new Date().toISOString().split('T')[0]);
}

function showCalendarDate(dateStr) {
    const eventsOnDay = eventHubData.events.filter(e => e.date === dateStr);
    const eventsList = document.getElementById('calendarEventslist');
    const selectedDate = document.getElementById('selectedDate');
    selectedDate.textContent = formatDate(dateStr);
    if (eventsOnDay.length === 0) {
        eventsList.innerHTML = '<p class="empty-state">No events</p>';
        return;
    }
    eventsList.innerHTML = eventsOnDay.map(event => `
        <div class="calendar-event-item" onclick="showEventModal('${event.id}')">
            <strong>${event.title}</strong>
            <p>${event.time} - ${event.location}</p>
            <small>${event.description}</small>
        </div>
    `).join('');
}

// FORMS
function initializeForms() {
    const regForm = document.getElementById('registrationForm');
    if (regForm) regForm.onsubmit = submitRegistration;
}

function showEventModal(eventId) {
    const event = eventHubData.events.find(e => e.id === eventId);
    if (!event) return;
    const isRegistered = eventHubData.registrations.some(r => r.eventId === eventId);
    const modal = document.getElementById('eventModal');
    const modalBody = document.getElementById('eventModalBody');
    const spotsLeft = event.capacity - event.registered;
    
    modalBody.innerHTML = `
        <div class="event-modal-header">
            <h2>${event.title}</h2>
            <span class="event-status-badge status-${event.status}">${event.status}</span>
        </div>
        <div class="event-modal-body">
            <div class="event-modal-image">${event.image}</div>
            <div class="event-modal-content">
                <h3>Event Details</h3>
                <p>${event.details || event.description}</p>
                <div class="event-info-grid">
                    <div class="info-item"><span class="info-label">📅 Date</span><span class="info-value">${formatDate(event.date)}</span></div>
                    <div class="info-item"><span class="info-label">⏰ Time</span><span class="info-value">${event.time} - ${event.endTime}</span></div>
                    <div class="info-item"><span class="info-label">📍 Location</span><span class="info-value">${event.location}</span></div>
                    <div class="info-item"><span class="info-label">👥 Capacity</span><span class="info-value">${event.registered}/${event.capacity}</span></div>
                </div>
            </div>
        </div>
        <div class="event-modal-footer">
            ${isRegistered ? `<button class="btn btn-secondary" onclick="unregisterEvent('${event.id}')">Cancel</button>` : `<button class="btn btn-primary" onclick="openRegistrationModal('${event.id}')">Register</button>`}
            <button class="btn btn-secondary" onclick="closeModal('eventModal')">Close</button>
        </div>
    `;
    modal.style.display = 'block';
}

function openRegistrationModal(eventId) {
    const event = eventHubData.events.find(e => e.id === eventId);
    if (!event) return;
    document.getElementById('registrationForm').dataset.eventId = eventId;
    document.getElementById('eventModal').style.display = 'none';
    const modal = document.getElementById('registrationModal');
    modal.style.display = 'block';
    document.getElementById('regFirstName').value = eventHubData.currentUser.firstName;
    document.getElementById('regLastName').value = eventHubData.currentUser.lastName;
    document.getElementById('regEmail').value = eventHubData.currentUser.email;
    document.getElementById('regDepartment').value = eventHubData.currentUser.department;
}

function closeRegistrationModal() {
    document.getElementById('registrationModal').style.display = 'none';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

function submitRegistration(e) {
    e.preventDefault();
    const eventId = document.getElementById('registrationForm').dataset.eventId;
    const event = eventHubData.events.find(e => e.id === eventId);
    if (!event) return;
    
    if (eventHubData.registrations.some(r => r.eventId === eventId && r.userId === eventHubData.currentUser.id)) {
        alert('Already registered!');
        return;
    }
    if (event.registered >= event.capacity) {
        alert('Event is full!');
        return;
    }
    
    const registration = {
        id: 'reg_' + Math.random().toString(36).substr(2, 9),
        eventId: eventId,
        userId: eventHubData.currentUser.id,
        firstName: document.getElementById('regFirstName').value,
        lastName: document.getElementById('regLastName').value,
        email: document.getElementById('regEmail').value,
        contact: document.getElementById('regContact').value,
        department: document.getElementById('regDepartment').value,
        registrationDate: new Date().toISOString().split('T')[0],
        status: 'registered'
    };
    
    eventHubData.currentUser.firstName = registration.firstName;
    eventHubData.currentUser.lastName = registration.lastName;
    eventHubData.currentUser.email = registration.email;
    eventHubData.currentUser.department = registration.department;
    
    eventHubData.registrations.push(registration);
    event.registered++;
    saveData();
    updateUserDisplay();
    closeRegistrationModal();
    alert('Registered for ' + event.title + '!');
    renderBrowseEvents();
    renderMyRegistrations();
}

function unregisterEvent(eventId) {
    if (!confirm('Cancel registration?')) return;
    const event = eventHubData.events.find(e => e.id === eventId);
    if (!event) return;
    const regIndex = eventHubData.registrations.findIndex(r => r.eventId === eventId && r.userId === eventHubData.currentUser.id);
    if (regIndex > -1) {
        eventHubData.registrations.splice(regIndex, 1);
        event.registered--;
        saveData();
        renderBrowseEvents();
        renderMyRegistrations();
        alert('Unregistered successfully!');
        closeModal('eventModal');
    }
}

function formatDate(dateStr) {
    const date = new Date(dateStr);
    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

window.addEventListener('load', function() {
    loadData();
    updateUserDisplay();
});
