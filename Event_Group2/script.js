// EventHub Event Management System

// Data Storage
const eventHubData = {
    events: [],
    students: [],
    volunteers: [],
    resources: [],
    announcements: [],
    feedback: [],
    attendance: {}
};

// Load data from localStorage
function loadData() {
    const saved = localStorage.getItem('eventHubData');
    if (saved) {
        Object.assign(eventHubData, JSON.parse(saved));
    }
}

// Save data to localStorage
function saveData() {
    localStorage.setItem('eventHubData', JSON.stringify(eventHubData));
}

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    loadData();
    initializeNavigation();
    initializeTabs();
    initializeForms();
    initializeCalendar();
    initializeModal();
    renderAllData();
    populateEventDropdowns();
});

// Navigation
function initializeNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const sectionId = this.getAttribute('data-section');
            
            // Remove active class from all nav items and sections
            navItems.forEach(nav => nav.classList.remove('active'));
            document.querySelectorAll('.section').forEach(sec => sec.classList.remove('active'));
            
            // Add active class
            this.classList.add('active');
            document.getElementById(sectionId).classList.add('active');
            
            // Refresh event dropdowns when navigating to a section
            populateEventDropdowns();
        });
    });
}

// Tab Functionality
function initializeTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    
    tabButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const tabName = this.getAttribute('data-tab');
            const tabsContainer = this.closest('.tabs-container');
            
            // Remove active from all tabs and contents in this container
            tabsContainer.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            tabsContainer.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
            
            // Add active to clicked tab
            this.classList.add('active');
            tabsContainer.querySelector(`#${tabName}`).classList.add('active');
        });
    });
}

// Populate all event dropdowns dynamically
function populateEventDropdowns() {
    const dropdownIds = [
        'volunteerEvent',
        'resourceEvent',
        'announcementEvent',
        'feedbackEvent',
        'reportEventSelect',
        'studentEvent'
    ];
    
    dropdownIds.forEach(dropdownId => {
        const dropdown = document.getElementById(dropdownId);
        if (!dropdown) return;
        
        // Store the current value before clearing
        const currentValue = dropdown.value;
        
        // Get all options except the first one (placeholder)
        const firstOption = dropdown.options[0];
        
        // Clear all options
        dropdown.innerHTML = '';
        
        // Re-add the first option
        if (firstOption) {
            dropdown.appendChild(firstOption.cloneNode(true));
        }
        
        // Add all approved events for student registration
        const eventsToShow = dropdownId === 'studentEvent' 
            ? eventHubData.events.filter(e => e.status === 'Approved')
            : eventHubData.events;
        
        eventsToShow.forEach(event => {
            const option = document.createElement('option');
            option.value = event.name;
            option.textContent = event.name;
            dropdown.appendChild(option);
        });
        
        // Restore the previous value if it still exists
        if (currentValue && Array.from(dropdown.options).some(opt => opt.value === currentValue)) {
            dropdown.value = currentValue;
        }
    });
}

// Form Initialization
function initializeForms() {
    // Event Planning Form
    const eventForm = document.getElementById('eventForm');
    if (eventForm) {
        eventForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const event = {
                id: eventHubData.events.length + 1,
                name: document.getElementById('eventName').value,
                date: document.getElementById('eventDate').value,
                time: document.getElementById('eventTime').value,
                location: document.getElementById('eventLocation').value,
                description: document.getElementById('eventDescription').value,
                programFlow: document.getElementById('programFlow').value,
                budget: parseFloat(document.getElementById('eventBudget').value),
                status: 'Pending',
                approvedDate: null,
                postedToCalendar: false
            };
            eventHubData.events.push(event);
            saveData();
            this.reset();
            renderPendingApprovals();
            renderAllEvents();
            renderDashboard();
            populateEventDropdowns();
            showNotification('Event submitted for approval!');
        });
    }

    // Volunteer Form
    const volunteerForm = document.getElementById('volunteerForm');
    if (volunteerForm) {
        volunteerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const volunteer = {
                id: eventHubData.volunteers.length + 1,
                name: document.getElementById('volunteerName').value,
                email: document.getElementById('volunteerEmail').value,
                event: document.getElementById('volunteerEvent').value,
                task: document.getElementById('volunteerTask').value,
                status: 'assigned'
            };
            eventHubData.volunteers.push(volunteer);
            saveData();
            this.reset();
            renderVolunteers();
            renderDashboard();
            toggleVolunteerForm(false);
            showNotification('Volunteer assigned successfully!');
        });
    }

    // Resource Form
    const resourceForm = document.getElementById('resourceForm');
    if (resourceForm) {
        resourceForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const resource = {
                id: eventHubData.resources.length + 1,
                name: document.getElementById('resourceName').value,
                type: document.getElementById('resourceType').value,
                qty: document.getElementById('resourceQty').value,
                event: document.getElementById('resourceEvent').value,
                status: 'reserved'
            };
            eventHubData.resources.push(resource);
            saveData();
            this.reset();
            renderResources();
            toggleResourceForm(false);
            showNotification('Resource added successfully!');
        });
    }

    // Announcement Form
    const announcementForm = document.getElementById('announcementForm');
    if (announcementForm) {
        announcementForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const announcement = {
                id: eventHubData.announcements.length + 1,
                title: document.getElementById('announcementTitle').value,
                event: document.getElementById('announcementEvent').value,
                message: document.getElementById('announcementMessage').value,
                date: new Date().toISOString().split('T')[0]
            };
            eventHubData.announcements.push(announcement);
            saveData();
            this.reset();
            renderAnnouncements();
            renderDashboard();
            toggleAnnouncementForm(false);
            showNotification('Announcement posted successfully!');
        });
    }

    // Feedback Form
    const feedbackForm = document.getElementById('feedbackForm');
    if (feedbackForm) {
        feedbackForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const feedback = {
                id: eventHubData.feedback.length + 1,
                name: document.getElementById('feedbackName').value,
                event: document.getElementById('feedbackEvent').value,
                rating: document.getElementById('feedbackRating').value,
                comment: document.getElementById('feedbackComment').value,
                date: new Date().toISOString().split('T')[0]
            };
            eventHubData.feedback.push(feedback);
            saveData();
            this.reset();
            renderFeedback();
            toggleFeedbackForm(false);
            showNotification('Feedback submitted successfully!');
        });
    }

    // Student Form
    const studentForm = document.getElementById('studentForm');
    if (studentForm) {
        studentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const student = {
                id: eventHubData.students.length + 1,
                firstName: document.getElementById('studentFirstName').value,
                lastName: document.getElementById('studentLastName').value,
                email: document.getElementById('studentEmail').value,
                grade: document.getElementById('studentGrade').value,
                section: document.getElementById('studentSection').value,
                contact: document.getElementById('studentContact').value,
                event: document.getElementById('studentEvent').value
            };
            eventHubData.students.push(student);
            saveData();
            this.reset();
            renderStudents();
            renderDashboard();
            showNotification('Student registered successfully!');
        });
    }

    // Button event listeners
    const assignVolunteerBtn = document.getElementById('assignVolunteerBtn');
    if (assignVolunteerBtn) {
        assignVolunteerBtn.addEventListener('click', () => {
            populateEventDropdowns();
            toggleVolunteerForm(true);
        });
    }

    const cancelVolunteerBtn = document.getElementById('cancelVolunteerBtn');
    if (cancelVolunteerBtn) {
        cancelVolunteerBtn.addEventListener('click', () => toggleVolunteerForm(false));
    }

    const addResourceBtn = document.getElementById('addResourceBtn');
    if (addResourceBtn) {
        addResourceBtn.addEventListener('click', () => {
            populateEventDropdowns();
            toggleResourceForm(true);
        });
    }

    const cancelResourceBtn = document.getElementById('cancelResourceBtn');
    if (cancelResourceBtn) {
        cancelResourceBtn.addEventListener('click', () => toggleResourceForm(false));
    }

    const postAnnouncementBtn = document.getElementById('postAnnouncementBtn');
    if (postAnnouncementBtn) {
        postAnnouncementBtn.addEventListener('click', () => {
            populateEventDropdowns();
            toggleAnnouncementForm(true);
        });
    }

    const cancelAnnouncementBtn = document.getElementById('cancelAnnouncementBtn');
    if (cancelAnnouncementBtn) {
        cancelAnnouncementBtn.addEventListener('click', () => toggleAnnouncementForm(false));
    }

    const submitFeedbackBtn = document.getElementById('submitFeedbackBtn');
    if (submitFeedbackBtn) {
        submitFeedbackBtn.addEventListener('click', () => {
            populateEventDropdowns();
            toggleFeedbackForm(true);
        });
    }

    const cancelFeedbackBtn = document.getElementById('cancelFeedbackBtn');
    if (cancelFeedbackBtn) {
        cancelFeedbackBtn.addEventListener('click', () => toggleFeedbackForm(false));
    }

    const generateAttendanceBtn = document.getElementById('generateAttendanceBtn');
    if (generateAttendanceBtn) {
        generateAttendanceBtn.addEventListener('click', generateAttendance);
    }

    // Event Approval Handlers
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('approve-btn')) {
            approveEvent(parseInt(e.target.dataset.eventId));
        }
        if (e.target.classList.contains('deny-btn')) {
            denyEvent(parseInt(e.target.dataset.eventId));
        }
    });
    
    // Report event selector change
    const reportEventSelect = document.getElementById('reportEventSelect');
    if (reportEventSelect) {
        reportEventSelect.addEventListener('change', function() {
            if (this.value) {
                generateAttendance();
                generateEventReport();
            }
        });
    }
}

// Toggle Functions
function toggleVolunteerForm(show) {
    const container = document.getElementById('volunteerFormContainer');
    if (show) {
        container.classList.remove('hidden');
    } else {
        container.classList.add('hidden');
        document.getElementById('volunteerForm').reset();
    }
}

function toggleResourceForm(show) {
    const container = document.getElementById('resourceFormContainer');
    if (show) {
        container.classList.remove('hidden');
    } else {
        container.classList.add('hidden');
        document.getElementById('resourceForm').reset();
    }
}

function toggleAnnouncementForm(show) {
    const container = document.getElementById('announcementFormContainer');
    if (show) {
        container.classList.remove('hidden');
    } else {
        container.classList.add('hidden');
        document.getElementById('announcementForm').reset();
    }
}

function toggleFeedbackForm(show) {
    const container = document.getElementById('feedbackFormContainer');
    if (show) {
        container.classList.remove('hidden');
    } else {
        container.classList.add('hidden');
        document.getElementById('feedbackForm').reset();
    }
}

// Render Functions
function renderAllData() {
    renderDashboard();
    renderPendingApprovals();
    renderAllEvents();
    renderActivitiesCalendar();
    renderVolunteers();
    renderResources();
    renderAnnouncements();
    renderFeedback();
    renderStudents();
    populateEventDropdowns();
}

// Dashboard Rendering
function renderDashboard() {
    // Count statistics
    const totalEvents = eventHubData.events.length;
    const totalStudents = eventHubData.students.length;
    const totalVolunteers = eventHubData.volunteers.length;
    const totalAnnouncements = eventHubData.announcements.length;
    const approvedCount = eventHubData.events.filter(e => e.status === 'Approved').length;
    const pendingCount = eventHubData.events.filter(e => e.status === 'Pending').length;
    const deniedCount = eventHubData.events.filter(e => e.status === 'Denied').length;
    
    // Render main cards
    const dashboardCards = document.getElementById('dashboardCards');
    if (dashboardCards) {
        dashboardCards.innerHTML = `
            <div class="card">
                <div class="card-icon">📋</div>
                <div class="card-content">
                    <div class="card-value">${totalEvents}</div>
                    <div class="card-label">Total Events</div>
                </div>
            </div>
            <div class="card">
                <div class="card-icon">👥</div>
                <div class="card-content">
                    <div class="card-value">${totalStudents}</div>
                    <div class="card-label">Registered Students</div>
                </div>
            </div>
            <div class="card">
                <div class="card-icon">🤝</div>
                <div class="card-content">
                    <div class="card-value">${totalVolunteers}</div>
                    <div class="card-label">Volunteers</div>
                </div>
            </div>
            <div class="card">
                <div class="card-icon">📢</div>
                <div class="card-content">
                    <div class="card-value">${totalAnnouncements}</div>
                    <div class="card-label">Announcements</div>
                </div>
            </div>
        `;
    }
    
    // Render status cards
    const statusCards = document.getElementById('statusCards');
    if (statusCards) {
        statusCards.innerHTML = `
            <div class="card status-card approved">
                <div class="card-icon">✓</div>
                <div class="card-content">
                    <div class="card-value">${approvedCount}</div>
                    <div class="card-label">Approved</div>
                </div>
            </div>
            <div class="card status-card pending">
                <div class="card-icon">⏳</div>
                <div class="card-content">
                    <div class="card-value">${pendingCount}</div>
                    <div class="card-label">Pending</div>
                </div>
            </div>
            <div class="card status-card denied">
                <div class="card-icon">✕</div>
                <div class="card-content">
                    <div class="card-value">${deniedCount}</div>
                    <div class="card-label">Denied</div>
                </div>
            </div>
        `;
    }
    
    // Render recent events
    const recentEventsBody = document.getElementById('recentEventsBody');
    if (recentEventsBody) {
        if (eventHubData.events.length === 0) {
            recentEventsBody.innerHTML = '<tr><td colspan="4" style="text-align:center; color: var(--text-light);">No events created yet</td></tr>';
            return;
        }
        
        // Get recent 3 events
        const recentEvents = eventHubData.events.slice(-3).reverse();
        recentEventsBody.innerHTML = recentEvents.map(event => `
            <tr>
                <td><strong>${event.name}</strong></td>
                <td>${event.date}</td>
                <td>${event.location}</td>
                <td><span class="status-badge ${event.status === 'Approved' ? 'confirmed' : event.status === 'Denied' ? 'denied' : 'assigned'}">${event.status}</span></td>
            </tr>
        `).join('');
    }
}

function renderPendingApprovals() {
    const tbody = document.getElementById('pendingApprovalsBody');
    if (!tbody) return;
    
    const pending = eventHubData.events.filter(e => e.status === 'Pending');
    
    if (pending.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; color: var(--text-light);">No pending approvals</td></tr>';
        return;
    }
    
    tbody.innerHTML = pending.map(event => `
        <tr>
            <td>${event.name}</td>
            <td>${event.date}</td>
            <td>₱${event.budget.toLocaleString('en-PH')}</td>
            <td><span class="status-badge assigned">Pending</span></td>
            <td>
                <button class="btn btn-small approve-btn" data-event-id="${event.id}" style="background: #059669; color: white; margin-right: 4px;">Approve</button>
                <button class="btn btn-small deny-btn" data-event-id="${event.id}" style="background: #dc2626; color: white;">Deny</button>
            </td>
        </tr>
    `).join('');
}

function renderAllEvents() {
    const tbody = document.getElementById('allEventsTableBody');
    if (!tbody) return;
    
    if (eventHubData.events.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; color: var(--text-light);">No events created yet</td></tr>';
        return;
    }
    
    tbody.innerHTML = eventHubData.events.map(event => `
        <tr>
            <td><strong>${event.name}</strong></td>
            <td>${event.date}</td>
            <td>₱${event.budget.toLocaleString('en-PH')}</td>
            <td><span class="status-badge ${event.status === 'Approved' ? 'confirmed' : event.status === 'Denied' ? 'denied' : 'assigned'}">${event.status}</span></td>
            <td><span class="status-badge ${event.postedToCalendar ? 'confirmed' : 'assigned'}">${event.postedToCalendar ? 'Posted' : 'Not Posted'}</span></td>
        </tr>
    `).join('');
}

function renderActivitiesCalendar() {
    const tbody = document.getElementById('activitiesTableBody');
    if (!tbody) return;
    
    const approved = eventHubData.events.filter(e => e.status === 'Approved');
    
    if (approved.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; color: var(--text-light);">No approved events scheduled</td></tr>';
        return;
    }
    
    tbody.innerHTML = approved.map(event => `
        <tr>
            <td><strong>${event.name}</strong></td>
            <td>${event.date}</td>
            <td>${event.time}</td>
            <td>${event.location}</td>
            <td>₱${event.budget.toLocaleString('en-PH')}</td>
            <td><span class="status-badge confirmed">✓ Approved</span></td>
        </tr>
    `).join('');
}

function renderVolunteers() {
    const tbody = document.getElementById('volunteersTableBody');
    if (!tbody) return;
    
    if (eventHubData.volunteers.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; color: var(--text-light);">No volunteers assigned yet</td></tr>';
        return;
    }
    
    tbody.innerHTML = eventHubData.volunteers.map(volunteer => `
        <tr>
            <td>${volunteer.name}</td>
            <td>${volunteer.email}</td>
            <td>${volunteer.event}</td>
            <td>${volunteer.task}</td>
            <td><span class="status-badge ${volunteer.status}">${volunteer.status}</span></td>
        </tr>
    `).join('');
}

function renderResources() {
    const tbody = document.getElementById('resourcesTableBody');
    if (!tbody) return;
    
    if (eventHubData.resources.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; color: var(--text-light);">No resources added yet</td></tr>';
        return;
    }
    
    tbody.innerHTML = eventHubData.resources.map(resource => `
        <tr>
            <td>${resource.name}</td>
            <td>${resource.type}</td>
            <td>${resource.qty}</td>
            <td>${resource.event}</td>
            <td><span class="status-badge confirmed">${resource.status}</span></td>
        </tr>
    `).join('');
}

function renderAnnouncements() {
    const container = document.getElementById('announcementsList');
    if (!container) return;
    
    if (eventHubData.announcements.length === 0) {
        container.innerHTML = '<p class="empty-state">No announcements yet.</p>';
        return;
    }
    
    container.innerHTML = eventHubData.announcements.map(ann => `
        <div class="announcement-item">
            <div class="announcement-icon">ℹ</div>
            <div class="announcement-content">
                <h3>${ann.title}</h3>
                <p>${ann.message}</p>
                <small>${ann.date}${ann.event ? ' • Related to: ' + ann.event : ''}</small>
            </div>
        </div>
    `).join('');
}

function renderFeedback() {
    const container = document.getElementById('feedbackList');
    if (!container) return;
    
    if (eventHubData.feedback.length === 0) {
        container.innerHTML = '<p class="empty-state">No feedback yet.</p>';
        return;
    }
    
    container.innerHTML = eventHubData.feedback.map(fb => `
        <div class="feedback-item">
            <div class="feedback-header">
                <span class="feedback-name">${fb.name}</span>
                <span class="feedback-rating">${fb.rating}</span>
            </div>
            <div class="feedback-event">Event: ${fb.event}</div>
            <div class="feedback-comment">${fb.comment}</div>
            <small>${fb.date}</small>
        </div>
    `).join('');
}

function renderStudents() {
    const tbody = document.getElementById('studentsTableBody');
    if (!tbody) return;
    
    if (eventHubData.students.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; color: var(--text-light);">No students registered yet</td></tr>';
        return;
    }
    
    tbody.innerHTML = eventHubData.students.map(student => `
        <tr>
            <td>${student.firstName} ${student.lastName}</td>
            <td>${student.email}</td>
            <td>${student.grade}</td>
            <td>${student.section}</td>
            <td>${student.contact}</td>
            <td>${student.event}</td>
        </tr>
    `).join('');
}

// Event Approval Functions
function approveEvent(eventId) {
    const event = eventHubData.events.find(e => e.id === eventId);
    if (!event) return;
    
    event.status = 'Approved';
    event.approvedDate = new Date().toISOString().split('T')[0];
    event.postedToCalendar = true;
    
    saveData();
    renderAllData();
    
    // Automatically navigate to calendar section
    document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
    document.querySelectorAll('.section').forEach(sec => sec.classList.remove('active'));
    
    const calendarNav = document.querySelector('.nav-item[data-section="calendar"]');
    const calendarSection = document.getElementById('calendar');
    
    if (calendarNav && calendarSection) {
        calendarNav.classList.add('active');
        calendarSection.classList.add('active');
    }
    
    showNotification(`✓ "${event.name}" approved and posted to calendar! Redirected to Calendar view.`);
}

function denyEvent(eventId) {
    const event = eventHubData.events.find(e => e.id === eventId);
    if (!event) return;
    
    event.status = 'Denied';
    event.postedToCalendar = false;
    
    saveData();
    renderAllData();
    showNotification(`✗ "${event.name}" has been denied`, 'warning');
}

// Modal Functionality
function initializeModal() {
    const modal = document.getElementById('eventModal');
    const closeBtn = document.querySelector('.modal-close');
    
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.classList.remove('show');
        });
    }
    
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('show');
        }
    });
}

function showEventDetails(dateString) {
    const eventsOnDay = eventHubData.events.filter(e => e.date === dateString && e.status === 'Approved');
    
    if (eventsOnDay.length === 0) return;
    
    const modal = document.getElementById('eventModal');
    const modalBody = document.getElementById('eventModalBody');
    
    // If multiple events on the same day, show the first one
    const event = eventsOnDay[0];
    
    // Get attendees for this event
    const students = eventHubData.students.filter(s => s.event === event.name);
    const volunteers = eventHubData.volunteers.filter(v => v.event === event.name);
    
    let html = `
        <div class="modal-header">
            <h2>${event.name}</h2>
            <div class="event-date-time">${formatDate(event.date)} at ${event.time}</div>
        </div>
        
        <div class="modal-info-grid">
            <div class="modal-info-item">
                <div class="modal-info-label">Location</div>
                <div class="modal-info-value">${event.location}</div>
            </div>
            <div class="modal-info-item">
                <div class="modal-info-label">Budget</div>
                <div class="modal-info-value">₱${event.budget.toLocaleString('en-PH')}</div>
            </div>
            <div class="modal-info-item">
                <div class="modal-info-label">Status</div>
                <div class="modal-info-value"><span class="status-badge confirmed">${event.status}</span></div>
            </div>
            <div class="modal-info-item">
                <div class="modal-info-label">Attendees</div>
                <div class="modal-info-value">${students.length} Students, ${volunteers.length} Volunteers</div>
            </div>
        </div>
    `;
    
    if (event.description) {
        html += `
            <div class="modal-section">
                <h3>Description</h3>
                <p>${event.description}</p>
            </div>
        `;
    }
    
    if (event.programFlow) {
        html += `
            <div class="modal-section">
                <h3>Program Flow</h3>
                <p>${event.programFlow}</p>
            </div>
        `;
    }
    
    // Show registered students
    if (students.length > 0) {
        html += `
            <div class="modal-attendees">
                <h4>Registered Students (${students.length})</h4>
                ${students.map(s => `
                    <div class="attendee-item">
                        <div class="attendee-name">${s.firstName} ${s.lastName}</div>
                        <div class="attendee-details">${s.grade} - ${s.section} | ${s.email}</div>
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    // Show volunteers
    if (volunteers.length > 0) {
        html += `
            <div class="modal-attendees">
                <h4>Volunteers (${volunteers.length})</h4>
                ${volunteers.map(v => `
                    <div class="attendee-item">
                        <div class="attendee-name">${v.name}</div>
                        <div class="attendee-details">${v.task} | ${v.email}</div>
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    if (eventsOnDay.length > 1) {
        html += `
            <div class="modal-section">
                <p style="font-style: italic; color: var(--text-light);">Note: ${eventsOnDay.length} events scheduled on this day. Showing details for the first event.</p>
            </div>
        `;
    }
    
    modalBody.innerHTML = html;
    modal.classList.add('show');
}

function formatDate(dateString) {
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
}

// Calendar Functionality
function initializeCalendar() {
    let currentDate = new Date();
    
    function renderCalendar() {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        
        // Update header
        const monthYear = document.getElementById('monthYear');
        if (monthYear) {
            monthYear.textContent = new Date(year, month).toLocaleDateString('en-US', { 
                month: 'long', 
                year: 'numeric' 
            });
        }
        
        // Get first day of month and number of days
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const daysInPrevMonth = new Date(year, month, 0).getDate();
        
        const calendarDays = document.getElementById('calendarDays');
        if (!calendarDays) return;
        
        calendarDays.innerHTML = '';
        
        // Previous month days
        for (let i = firstDay - 1; i >= 0; i--) {
            const day = document.createElement('div');
            day.className = 'calendar-day other-month';
            day.textContent = daysInPrevMonth - i;
            calendarDays.appendChild(day);
        }
        
        // Current month days
        for (let i = 1; i <= daysInMonth; i++) {
            const day = document.createElement('div');
            day.className = 'calendar-day';
            
            // Removed today highlighting
            // const today = new Date();
            // if (i === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
            //     day.classList.add('today');
            // }
            
            // Check for approved events on this day
            const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
            const eventsOnDay = eventHubData.events.filter(e => e.date === dateString && e.status === 'Approved');
            
            if (eventsOnDay.length > 0) {
                day.classList.add('has-event');
                day.innerHTML = `
                    <div class="calendar-day-number">${i}</div>
                    <div class="calendar-event-names">
                        ${eventsOnDay.map(e => `<div class="calendar-event-name" title="${e.name}">${e.name}</div>`).join('')}
                    </div>
                `;
                day.title = eventsOnDay.map(e => e.name).join(', ');
                
                // Add click event to show modal
                day.addEventListener('click', () => showEventDetails(dateString));
                day.style.cursor = 'pointer';
            } else {
                day.textContent = i;
            }
            
            calendarDays.appendChild(day);
        }
        
        // Next month days
        const totalCells = calendarDays.children.length;
        const remainingCells = 42 - totalCells;
        for (let i = 1; i <= remainingCells; i++) {
            const day = document.createElement('div');
            day.className = 'calendar-day other-month';
            day.textContent = i;
            calendarDays.appendChild(day);
        }
    }
    
    const prevBtn = document.getElementById('prevMonth');
    const nextBtn = document.getElementById('nextMonth');
    
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() - 1);
            renderCalendar();
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() + 1);
            renderCalendar();
        });
    }
    
    renderCalendar();
}

// Generate Attendance Report (Per Event)
function generateAttendance() {
    const eventSelect = document.getElementById('reportEventSelect');
    const selectedEvent = eventSelect.value;
    
    if (!selectedEvent) {
        showNotification('Please select an event', 'warning');
        return;
    }
    
    const attendanceContent = document.getElementById('attendanceContent');
    const event = eventHubData.events.find(e => e.name === selectedEvent);
    const students = eventHubData.students.filter(s => s.event === selectedEvent);
    const volunteers = eventHubData.volunteers.filter(v => v.event === selectedEvent);
    
    if (!event) {
        attendanceContent.innerHTML = '<div class="empty-state"><p>Event not found</p></div>';
        return;
    }
    
    let html = `
        <div class="attendance-title">Attendance Report - ${event.name}</div>
        <div class="attendance-info">
            <strong>Event:</strong> ${event.name}<br>
            <strong>Date:</strong> ${event.date}<br>
            <strong>Time:</strong> ${event.time}<br>
            <strong>Location:</strong> ${event.location}<br>
            <strong>Status:</strong> ${event.status}
        </div>
        
        <div style="background: #f0f4ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #3b5bdb; margin-bottom: 16px;">Attendance Summary</h3>
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px;">
                <div>
                    <div style="font-size: 32px; font-weight: bold; color: #3b5bdb;">${students.length}</div>
                    <div style="font-size: 12px; color: #718096;">Registered Students</div>
                </div>
                <div>
                    <div style="font-size: 32px; font-weight: bold; color: #3b5bdb;">${volunteers.length}</div>
                    <div style="font-size: 12px; color: #718096;">Assigned Volunteers</div>
                </div>
            </div>
        </div>
    `;
    
    // Students Table
    if (students.length > 0) {
        html += `
        <h3 style="margin-top: 24px; margin-bottom: 12px; font-size: 16px; font-weight: 700;">Registered Students</h3>
        <table class="data-table">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Year Level</th>
                    <th>Section</th>
                    <th>Contact</th>
                </tr>
            </thead>
            <tbody>
                ${students.map(s => `
                    <tr>
                        <td><strong>${s.firstName} ${s.lastName}</strong></td>
                        <td>${s.email}</td>
                        <td>${s.grade}</td>
                        <td>${s.section}</td>
                        <td>${s.contact}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
        `;
    } else {
        html += `<div class="empty-state"><p>No students registered for this event yet</p></div>`;
    }
    
    // Volunteers Table
    if (volunteers.length > 0) {
        html += `
        <h3 style="margin-top: 24px; margin-bottom: 12px; font-size: 16px; font-weight: 700;">Assigned Volunteers</h3>
        <table class="data-table">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Task</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                ${volunteers.map(v => `
                    <tr>
                        <td><strong>${v.name}</strong></td>
                        <td>${v.email}</td>
                        <td>${v.task}</td>
                        <td><span class="status-badge ${v.status}">${v.status}</span></td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
        `;
    }
    
    html += `
        <div class="attendance-info" style="margin-top: 24px;">
            <strong>Total Attendees:</strong> ${students.length + volunteers.length} (${students.length} Students + ${volunteers.length} Volunteers)
        </div>
    `;
    
    attendanceContent.innerHTML = html;
}

// Event Report Generation
function generateEventReport() {
    const eventSelect = document.getElementById('reportEventSelect');
    const selectedEvent = eventSelect.value;
    
    if (!selectedEvent) {
        showNotification('Please select an event', 'warning');
        return;
    }
    
    const event = eventHubData.events.find(e => e.name === selectedEvent);
    const students = eventHubData.students.filter(s => s.event === selectedEvent);
    const volunteers = eventHubData.volunteers.filter(v => v.event === selectedEvent);
    const resources = eventHubData.resources.filter(r => r.event === selectedEvent);
    const feedback = eventHubData.feedback.filter(f => f.event === selectedEvent);
    
    if (!event) {
        document.getElementById('reportContent').innerHTML = '<div class="empty-state"><p>Event not found</p></div>';
        return;
    }
    
    const avgRating = feedback.length > 0 
        ? (feedback.reduce((sum, f) => sum + parseInt(f.rating), 0) / feedback.length).toFixed(1)
        : 'N/A';
    
    let html = `
        <div class="attendance-title">Event Report - ${event.name}</div>
        <div class="attendance-info">
            <strong>Event:</strong> ${event.name}<br>
            <strong>Date:</strong> ${event.date} at ${event.time}<br>
            <strong>Location:</strong> ${event.location}<br>
            <strong>Description:</strong> ${event.description || 'N/A'}<br>
            <strong>Budget:</strong> ₱${event.budget.toLocaleString('en-PH')}<br>
            <strong>Status:</strong> ${event.status}
        </div>
        
        <div style="background: #f0f4ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #3b5bdb; margin-bottom: 16px;">Summary</h3>
            <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px;">
                <div>
                    <div style="font-size: 24px; font-weight: bold; color: #3b5bdb;">${students.length}</div>
                    <div style="font-size: 12px; color: #718096;">Students</div>
                </div>
                <div>
                    <div style="font-size: 24px; font-weight: bold; color: #3b5bdb;">${volunteers.length}</div>
                    <div style="font-size: 12px; color: #718096;">Volunteers</div>
                </div>
                <div>
                    <div style="font-size: 24px; font-weight: bold; color: #3b5bdb;">${resources.length}</div>
                    <div style="font-size: 12px; color: #718096;">Resources Used</div>
                </div>
                <div>
                    <div style="font-size: 24px; font-weight: bold; color: #3b5bdb;">${avgRating}</div>
                    <div style="font-size: 12px; color: #718096;">Avg. Rating</div>
                </div>
            </div>
        </div>
    `;
    
    if (resources.length > 0) {
        html += `
        <h3 style="margin-top: 24px; margin-bottom: 12px;">Resources Used</h3>
        <table class="data-table">
            <thead>
                <tr>
                    <th>Resource</th>
                    <th>Type</th>
                    <th>Quantity</th>
                </tr>
            </thead>
            <tbody>
                ${resources.map(r => `
                    <tr>
                        <td>${r.name}</td>
                        <td>${r.type}</td>
                        <td>${r.qty}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
        `;
    }
    
    if (feedback.length > 0) {
        html += `
            <h3 style="margin-top: 24px; margin-bottom: 12px;">Feedback Summary</h3>
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Person</th>
                        <th>Rating</th>
                        <th>Comment</th>
                    </tr>
                </thead>
                <tbody>
                    ${feedback.map(f => `
                        <tr>
                            <td>${f.name}</td>
                            <td>${f.rating}</td>
                            <td>${f.comment || 'No comment'}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    } else {
        html += '<p style="margin-top: 20px;">No feedback collected yet.</p>';
    }
    
    document.getElementById('reportContent').innerHTML = html;
}

// Notification
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    const bgColor = type === 'success' ? '#059669' : '#d97706';
    const icon = type === 'success' ? '✓' : '⚠';
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${bgColor};
        color: white;
        padding: 14px 20px;
        border-radius: 7px;
        z-index: 9999;
        animation: slideInRight 0.3s ease;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        font-weight: 500;
        font-size: 13px;
        letter-spacing: 0.2px;
        display: flex;
        align-items: center;
        gap: 10px;
    `;
    notification.innerHTML = `<span>${icon}</span><span>${message}</span>`;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add animation
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);