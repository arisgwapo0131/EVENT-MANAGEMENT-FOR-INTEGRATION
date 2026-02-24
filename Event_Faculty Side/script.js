// Faculty Event Management System

// Data Storage
const facultyData = {
    events: [],
    volunteers: [],
    resources: [],
    venues: []
};

// Load data from localStorage
function loadData() {
    const saved = localStorage.getItem('facultyEventData');
    if (saved) {
        Object.assign(facultyData, JSON.parse(saved));
    }
}

// Save data to localStorage
function saveData() {
    localStorage.setItem('facultyEventData', JSON.stringify(facultyData));
}

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    loadData();
    initializeNavigation();
    initializeTabs();
    initializeForms();
    initializeCalendar();
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
            
            navItems.forEach(nav => nav.classList.remove('active'));
            document.querySelectorAll('.section').forEach(sec => sec.classList.remove('active'));
            
            this.classList.add('active');
            document.getElementById(sectionId).classList.add('active');
            
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
            
            tabsContainer.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            tabsContainer.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
            
            this.classList.add('active');
            tabsContainer.querySelector(`#${tabName}`).classList.add('active');
        });
    });
}

// Populate Event Dropdowns
function populateEventDropdowns() {
    const dropdownIds = [
        'eventDetailsSelect',
        'volunteerEvent',
        'resourceEvent',
        'venueEvent'
    ];
    
    dropdownIds.forEach(dropdownId => {
        const dropdown = document.getElementById(dropdownId);
        if (!dropdown) return;
        
        const currentValue = dropdown.value;
        const firstOption = dropdown.options[0];
        
        dropdown.innerHTML = '';
        
        if (firstOption) {
            dropdown.appendChild(firstOption.cloneNode(true));
        }
        
        facultyData.events.forEach(event => {
            const option = document.createElement('option');
            option.value = event.name;
            option.textContent = event.name;
            dropdown.appendChild(option);
        });
        
        if (currentValue && Array.from(dropdown.options).some(opt => opt.value === currentValue)) {
            dropdown.value = currentValue;
        }
    });
}

// Form Initialization
function initializeForms() {
    // Event Creation Form
    const eventForm = document.getElementById('eventForm');
    if (eventForm) {
        eventForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const event = {
                id: facultyData.events.length + 1,
                name: document.getElementById('eventName').value,
                date: document.getElementById('eventDate').value,
                time: document.getElementById('eventTime').value,
                location: document.getElementById('eventLocation').value,
                description: document.getElementById('eventDescription').value,
                budget: parseFloat(document.getElementById('eventBudget').value),
                participants: parseInt(document.getElementById('eventParticipants').value),
                status: 'Pending',
                createdDate: new Date().toISOString().split('T')[0]
            };
            facultyData.events.push(event);
            saveData();
            this.reset();
            renderDashboard();
            populateEventDropdowns();
            showNotification('Event created successfully!');
        });
    }

    // Volunteer Assignment Form
    const volunteerForm = document.getElementById('volunteerForm');
    if (volunteerForm) {
        volunteerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const volunteer = {
                id: facultyData.volunteers.length + 1,
                name: document.getElementById('volunteerName').value,
                email: document.getElementById('volunteerEmail').value,
                event: document.getElementById('volunteerEvent').value,
                task: document.getElementById('volunteerTask').value,
                status: 'Assigned',
                assignedDate: new Date().toISOString().split('T')[0]
            };
            facultyData.volunteers.push(volunteer);
            saveData();
            this.reset();
            renderVolunteers();
            renderDashboard();
            showNotification('Volunteer assigned successfully!');
        });
    }

    // Resource Form
    const resourceForm = document.getElementById('resourceForm');
    if (resourceForm) {
        resourceForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const resource = {
                id: facultyData.resources.length + 1,
                name: document.getElementById('resourceName').value,
                type: document.getElementById('resourceType').value,
                qty: parseInt(document.getElementById('resourceQty').value),
                event: document.getElementById('resourceEvent').value,
                status: 'Reserved',
                dateAdded: new Date().toISOString().split('T')[0]
            };
            facultyData.resources.push(resource);
            saveData();
            this.reset();
            renderResources();
            showNotification('Resource added successfully!');
        });
    }

    // Venue Reservation Form
    const venueForm = document.getElementById('venueForm');
    if (venueForm) {
        venueForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const venue = {
                id: facultyData.venues.length + 1,
                name: document.getElementById('venueName').value,
                event: document.getElementById('venueEvent').value,
                date: document.getElementById('venueDate').value,
                time: document.getElementById('venueTime').value,
                capacity: parseInt(document.getElementById('venueCapacity').value),
                notes: document.getElementById('venueNotes').value,
                status: 'Reserved',
                reservationDate: new Date().toISOString().split('T')[0]
            };
            facultyData.venues.push(venue);
            saveData();
            this.reset();
            renderVenues();
            showNotification('Venue reserved successfully!');
        });
    }
}

// Render Dashboard
function renderDashboard() {
    const totalEvents = facultyData.events.length;
    const approvedEvents = facultyData.events.filter(e => e.status === 'Approved').length;
    const pendingEvents = facultyData.events.filter(e => e.status === 'Pending').length;
    const volunteerCount = facultyData.volunteers.length;
    
    document.getElementById('totalEvents').textContent = totalEvents;
    document.getElementById('approvedEvents').textContent = approvedEvents;
    document.getElementById('pendingEvents').textContent = pendingEvents;
    document.getElementById('volunteerCount').textContent = volunteerCount;
    
    // Render recent events
    const recentEventsBody = document.getElementById('recentEventsBody');
    recentEventsBody.innerHTML = '';
    
    const recentEvents = facultyData.events.slice(-5).reverse();
    recentEvents.forEach(event => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${event.name}</td>
            <td>${event.date}</td>
            <td>${event.time}</td>
            <td><span class="status-badge status-${event.status.toLowerCase()}">${event.status}</span></td>
            <td>₱${event.budget.toLocaleString()}</td>
        `;
        recentEventsBody.appendChild(row);
    });
}

// Render Event Details
function loadEventDetails() {
    const eventName = document.getElementById('eventDetailsSelect').value;
    if (!eventName) {
        document.getElementById('eventDetailsContent').style.display = 'none';
        return;
    }
    
    const budget = facultyData.events.find(e => e.name === eventName);
    if (!budget) return;
    
    const event = facultyData.events.find(e => e.name === eventName);
    if (!event) return;
    
    document.getElementById('detailsEventName').textContent = event.name;
    document.getElementById('detailDate').textContent = event.date;
    document.getElementById('detailTime').textContent = event.time;
    document.getElementById('detailLocation').textContent = event.location;
    document.getElementById('detailStatus').innerHTML = `<span class="status-badge status-${event.status.toLowerCase()}">${event.status}</span>`;
    document.getElementById('detailDescription').textContent = event.description;
    document.getElementById('detailBudget').textContent = '₱' + event.budget.toLocaleString();
    document.getElementById('detailParticipants').textContent = event.participants + ' expected';
    
    document.getElementById('eventDetailsContent').style.display = 'block';
}

// Render Volunteers
function renderVolunteers() {
    const volunteersBody = document.getElementById('volunteersTableBody');
    volunteersBody.innerHTML = '';
    
    facultyData.volunteers.forEach(volunteer => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${volunteer.name}</td>
            <td>${volunteer.event}</td>
            <td>${volunteer.task}</td>
            <td><span class="status-badge status-in-progress">${volunteer.status}</span></td>
            <td>
                <button class="btn btn-danger btn-small" onclick="deleteVolunteer(${volunteer.id})">Remove</button>
            </td>
        `;
        volunteersBody.appendChild(row);
    });
}

function deleteVolunteer(volunteerId) {
    if (confirm('Remove this volunteer assignment?')) {
        facultyData.volunteers = facultyData.volunteers.filter(v => v.id !== volunteerId);
        saveData();
        renderVolunteers();
        renderDashboard();
        showNotification('Volunteer removed.');
    }
}

// Render Resources
function renderResources() {
    const resourcesBody = document.getElementById('resourcesTableBody');
    resourcesBody.innerHTML = '';
    
    facultyData.resources.forEach(resource => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${resource.name}</td>
            <td>${resource.type}</td>
            <td>${resource.qty}</td>
            <td>${resource.event}</td>
            <td><span class="status-badge status-in-progress">${resource.status}</span></td>
            <td>
                <button class="btn btn-danger btn-small" onclick="deleteResource(${resource.id})">Remove</button>
            </td>
        `;
        resourcesBody.appendChild(row);
    });
}

function deleteResource(resourceId) {
    if (confirm('Remove this resource?')) {
        facultyData.resources = facultyData.resources.filter(r => r.id !== resourceId);
        saveData();
        renderResources();
        showNotification('Resource removed.');
    }
}

// Render Venues
function renderVenues() {
    const venueBody = document.getElementById('venueTableBody');
    venueBody.innerHTML = '';
    
    facultyData.venues.forEach(venue => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${venue.name}</td>
            <td>${venue.event}</td>
            <td>${venue.date}</td>
            <td>${venue.time}</td>
            <td>${venue.capacity}</td>
            <td><span class="status-badge status-in-progress">${venue.status}</span></td>
            <td>
                <button class="btn btn-danger btn-small" onclick="deleteVenue(${venue.id})">Cancel</button>
            </td>
        `;
        venueBody.appendChild(row);
    });
}

function deleteVenue(venueId) {
    if (confirm('Cancel this venue reservation?')) {
        facultyData.venues = facultyData.venues.filter(v => v.id !== venueId);
        saveData();
        renderVenues();
        renderCalendar();
        showNotification('Venue reservation cancelled.');
    }
}

// Calendar Functionality
let currentDate = new Date();

function initializeCalendar() {
    document.getElementById('prevMonth').addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar();
    });
    
    document.getElementById('nextMonth').addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
    });
    
    renderCalendar();
}

function renderCalendar() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    document.getElementById('monthYear').textContent = 
        currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const prevLastDay = new Date(year, month, 0);
    
    const prevDays = prevLastDay.getDate() - firstDay.getDay() + 1;
    const nextDays = 7 - lastDay.getDay();
    
    const calendarDays = document.getElementById('calendarDays');
    calendarDays.innerHTML = '';
    
    // Previous month days
    for (let i = prevDays; i <= prevLastDay.getDate(); i++) {
        const day = createDayElement(i, 'other-month');
        calendarDays.appendChild(day);
    }
    
    // Current month days
    for (let i = 1; i <= lastDay.getDate(); i++) {
        const date = new Date(year, month, i);
        const day = createDayElement(i);
        
        // Check if today
        const today = new Date();
        if (date.toDateString() === today.toDateString()) {
            day.classList.add('today');
        }
        
        // Check if has event
        const hasEvent = facultyData.events.some(e => {
            const eventDate = new Date(e.date);
            return eventDate.toDateString() === date.toDateString() && e.status === 'Approved';
        });
        
        if (hasEvent) {
            day.classList.add('has-event');
        }
        
        calendarDays.appendChild(day);
    }
    
    // Next month days
    for (let i = 1; i <= nextDays; i++) {
        const day = createDayElement(i, 'other-month');
        calendarDays.appendChild(day);
    }
    
    // Render activities table
    renderActivities();
}

function createDayElement(day, className = '') {
    const dayDiv = document.createElement('div');
    dayDiv.className = `calendar-day ${className}`;
    dayDiv.textContent = day;
    return dayDiv;
}

function renderActivities() {
    const activitiesBody = document.getElementById('activitiesTableBody');
    activitiesBody.innerHTML = '';
    
    const approvedEvents = facultyData.events.filter(e => e.status === 'Approved');
    approvedEvents.sort((a, b) => new Date(a.date) - new Date(b.date));
    
    approvedEvents.forEach(event => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${event.name}</td>
            <td>${event.date}</td>
            <td>${event.time}</td>
            <td>${event.location}</td>
            <td><span class="status-badge status-approved">Approved</span></td>
        `;
        activitiesBody.appendChild(row);
    });
}

// Render All Data
function renderAllData() {
    renderDashboard();
    renderVolunteers();
    renderResources();
    renderVenues();
    renderCalendar();
}

// Notifications
function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.className = `notification show ${type}`;
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Modal/Form visibility helpers
function showEventDetailsContent() {
    const content = document.getElementById('eventDetailsContent');
    if (content) {
        content.style.display = 'block';
    }
}
