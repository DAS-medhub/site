document.addEventListener('DOMContentLoaded', function () {
    // Mobile Menu Toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mainNav = document.querySelector('.main-nav');

    if (mobileMenuToggle && mainNav) {
        mobileMenuToggle.addEventListener('click', function (e) {
            e.stopPropagation();
            mainNav.classList.toggle('active');
            this.setAttribute('aria-expanded', mainNav.classList.contains('active'));
        });

        // Close menu when clicking outside or pressing Escape
        document.addEventListener('click', function (event) {
            if (!mobileMenuToggle.contains(event.target) && !mainNav.contains(event.target)) {
                mainNav.classList.remove('active');
                mobileMenuToggle.setAttribute('aria-expanded', 'false');
            }
        });

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && mainNav.classList.contains('active')) {
                mainNav.classList.remove('active');
                mobileMenuToggle.setAttribute('aria-expanded', 'false');
                mobileMenuToggle.focus();
            }
        });
    }

    // Initialize Google Maps (placeholder for actual implementation)
    function initMap() {
        const mapPlaceholder = document.querySelector('.map-placeholder');
        if (mapPlaceholder) {
            // This would be replaced with actual Google Maps API code
            console.log('Initializing map...');
            
            // Add click handlers for map markers
            const markers = document.querySelectorAll('.map-marker');
            markers.forEach(marker => {
                marker.addEventListener('click', function() {
                    const hospitalId = this.getAttribute('data-hospital');
                    scrollToHospitalCard(hospitalId);
                });
            });
        }
    }

    function scrollToHospitalCard(hospitalId) {
        // In a real implementation, this would scroll to the corresponding hospital card
        console.log(`Scrolling to hospital card: ${hospitalId}`);
        document.querySelector('.hospitals-list').scrollIntoView({ behavior: 'smooth' });
    }

    // Enhanced Booking Modal System
    const bookButtons = document.querySelectorAll('.book-btn, .transfer-btn, .refill-btn');
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'booking-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-modal" aria-label="Close modal">&times;</span>
            <div class="modal-header">
                <h3>Book Appointment with <span id="doctor-name"></span></h3>
            </div>
            <form id="appointment-form">
                <div class="form-group">
                    <label for="appointment-date">Date</label>
                    <input type="date" id="appointment-date" required aria-required="true">
                    <span class="error-message" id="date-error"></span>
                </div>
                <div class="form-group">
                    <label for="appointment-time">Time</label>
                    <select id="appointment-time" required aria-required="true">
                        <option value="">Select a time</option>
                        <option value="9:00 AM">9:00 AM</option>
                        <option value="10:00 AM">10:00 AM</option>
                        <option value="11:00 AM">11:00 AM</option>
                        <option value="1:00 PM">1:00 PM</option>
                        <option value="2:00 PM">2:00 PM</option>
                        <option value="3:00 PM">3:00 PM</option>
                        <option value="4:00 PM">4:00 PM</option>
                    </select>
                    <span class="error-message" id="time-error"></span>
                </div>
                <div class="form-group">
                    <label for="appointment-reason">Reason for Visit</label>
                    <textarea id="appointment-reason" rows="3" aria-describedby="reason-help"></textarea>
                    <small id="reason-help">Please describe your symptoms or reason for appointment</small>
                </div>
                <div class="form-actions">
                    <button type="submit" class="btn-primary">Confirm Booking</button>
                    <button type="button" class="btn-secondary close-modal-btn">Cancel</button>
                </div>
            </form>
            <div class="loading-overlay" id="modal-loading">
                <div class="spinner"></div>
                <p>Processing your request...</p>
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    // Modal functionality
    function openModal(title, type = 'appointment') {
        const modal = document.getElementById('booking-modal');
        const modalTitle = modal.querySelector('.modal-header h3');
        
        // Customize modal based on type
        if (type === 'prescription') {
            modalTitle.textContent = 'Transfer Prescription';
            // Would update form fields for prescription transfer
        } else if (type === 'refill') {
            modalTitle.textContent = 'Refill Prescription';
            // Would update form fields for refill
        } else {
            modalTitle.innerHTML = `Book ${title}`;
        }
        
        modal.style.display = 'block';
        document.body.classList.add('modal-open');
        modal.querySelector('input, select, textarea').focus();
    }

    function closeModal() {
        const modal = document.getElementById('booking-modal');
        modal.style.display = 'none';
        document.body.classList.remove('modal-open');
    }

    // Event listeners for modal
    document.querySelectorAll('.close-modal, .close-modal-btn').forEach(btn => {
        btn.addEventListener('click', closeModal);
    });

    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            closeModal();
        }
    });

    // Enhanced booking buttons
    if (bookButtons.length) {
        bookButtons.forEach(button => {
            button.addEventListener('click', function() {
                const title = this.getAttribute('data-title') || 
                             this.textContent.trim() || 
                             'Appointment';
                const type = this.classList.contains('transfer-btn') ? 'prescription' : 
                              this.classList.contains('refill-btn') ? 'refill' : 'appointment';
                
                openModal(title, type);
            });
        });
    }

    // Form validation with better UX
    const appointmentForm = document.getElementById('appointment-form');
    if (appointmentForm) {
        appointmentForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const date = document.getElementById('appointment-date');
            const time = document.getElementById('appointment-time');
            let isValid = true;
            
            // Reset error states
            document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
            document.querySelectorAll('.form-group').forEach(el => el.classList.remove('error'));
            
            // Validate date (must be today or in the future)
            if (!date.value) {
                document.getElementById('date-error').textContent = 'Please select a date';
                date.closest('.form-group').classList.add('error');
                isValid = false;
            } else {
                const selectedDate = new Date(date.value);
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                
                if (selectedDate < today) {
                    document.getElementById('date-error').textContent = 'Date must be today or in the future';
                    date.closest('.form-group').classList.add('error');
                    isValid = false;
                }
            }
            
            // Validate time
            if (!time.value) {
                document.getElementById('time-error').textContent = 'Please select a time';
                time.closest('.form-group').classList.add('error');
                isValid = false;
            }
            
            if (isValid) {
                // Show loading state
                const loadingOverlay = document.getElementById('modal-loading');
                loadingOverlay.style.display = 'flex';
                
                // Simulate API call
                try {
                    await new Promise(resolve => setTimeout(resolve, 1500));
                    
                    // Show success message
                    showToast('Booking confirmed successfully!', 'success');
                    
                    // Close modal after delay
                    setTimeout(() => {
                        closeModal();
                        loadingOverlay.style.display = 'none';
                        this.reset();
                    }, 1000);
                } catch (error) {
                    loadingOverlay.style.display = 'none';
                    showToast('Failed to book appointment. Please try again.', 'error');
                    console.error('Booking error:', error);
                }
            } else {
                // Focus on first error field
                const firstError = document.querySelector('.error');
                if (firstError) {
                    firstError.querySelector('input, select, textarea').focus();
                }
            }
        });
    }

    // Toast notification system
    function showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.setAttribute('role', 'alert');
        toast.setAttribute('aria-live', 'assertive');
        toast.innerHTML = `
            <div class="toast-message">${message}</div>
            <button class="toast-close" aria-label="Close notification">
                &times;
            </button>
        `;
        
        document.body.appendChild(toast);
        
        // Show toast
        setTimeout(() => {
            toast.classList.add('show');
        }, 10);
        
        // Auto-remove after delay
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 5000);
        
        // Close button
        toast.querySelector('.toast-close').addEventListener('click', () => {
            toast.classList.remove('show');
            setTimeout(() => {
                toast.remove();
            }, 300);
        });
    }

    // Enhanced Search Functionality
    const searchBox = document.querySelector('.search-box');
    if (searchBox) {
        const searchInput = searchBox.querySelector('input');
        const searchButton = searchBox.querySelector('button');
        
        // Search on button click
        searchButton.addEventListener('click', performSearch);
        
        // Search on Enter key
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
        
        function performSearch() {
            const query = searchInput.value.trim();
            if (query) {
                // Show loading state
                searchButton.disabled = true;
                searchButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Searching';
                
                // Simulate search
                setTimeout(() => {
                    // In a real app, this would filter results
                    showToast(`Showing results for "${query}"`, 'info');
                    searchButton.disabled = false;
                    searchButton.innerHTML = '<i class="fas fa-search"></i> Search';
                }, 1000);
            }
        }
    }

    // Prescription Upload Enhancement
    const uploadBtn = document.querySelector('.upload-btn');
    if (uploadBtn) {
        // Create hidden file input
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.pdf,.jpg,.jpeg,.png';
        fileInput.style.display = 'none';
        document.body.appendChild(fileInput);
        
        uploadBtn.addEventListener('click', function() {
            fileInput.click();
        });
        
        fileInput.addEventListener('change', function() {
            if (this.files && this.files[0]) {
                const fileName = this.files[0].name;
                showToast(`File "${fileName}" selected for upload`, 'success');
                
                // Simulate upload process
                uploadBtn.disabled = true;
                uploadBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Uploading...';
                
                setTimeout(() => {
                    showToast('Prescription uploaded successfully!', 'success');
                    uploadBtn.disabled = false;
                    uploadBtn.innerHTML = '<i class="fas fa-upload"></i> Upload Prescription';
                }, 2000);
            }
        });
    }

    // Emergency Call Button
    const emergencyBtn = document.querySelector('.emergency-call-btn');
    if (emergencyBtn) {
        emergencyBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            const confirmation = confirm('Are you sure you want to call emergency services?');
            if (confirmation) {
                // In a real app, this would initiate a phone call
                showToast('Calling emergency services...', 'alert');
                console.log('Initiating emergency call');
            }
        });
    }

    // Filter Application with Loading State
    const applyFilters = document.getElementById('apply-filters');
    if (applyFilters) {
        applyFilters.addEventListener('click', function() {
            const specialty = document.getElementById('specialty').value;
            const location = document.getElementById('location').value;
            const availability = document.getElementById('availability').value;
            
            // Show loading state
            this.disabled = true;
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Applying...';
            
            // Simulate filter application
            setTimeout(() => {
                showToast('Filters applied successfully', 'success');
                this.disabled = false;
                this.innerHTML = 'Apply Filters';
                
                // In a real app, this would filter the displayed results
                console.log(`Filters: Specialty=${specialty}, Location=${location}, Availability=${availability}`);
            }, 1000);
        });
    }

    // Initialize components when page loads
    initMap();
});

// Add CSS for new components via JavaScript
(function() {
    const style = document.createElement('style');
    style.textContent = `
        /* Modal enhancements */
        .modal-open {
            overflow: hidden;
        }
        
        .modal {
            display: none;
            position: fixed;
            z-index: 2000;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.7);
            backdrop-filter: blur(3px);
        }
        
        .modal-content {
            background-color: white;
            margin: 5% auto;
            padding: 30px;
            border-radius: 8px;
            width: 90%;
            max-width: 600px;
            position: relative;
            animation: modalFadeIn 0.3s ease-out;
        }
        
        @keyframes modalFadeIn {
            from { opacity: 0; transform: translateY(-20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        .close-modal {
            position: absolute;
            top: 15px;
            right: 15px;
            font-size: 1.5rem;
            cursor: pointer;
            color: #6c757d;
            background: none;
            border: none;
            padding: 5px;
        }
        
        .close-modal:hover {
            color: #2c7be5;
        }
        
        .loading-overlay {
            display: none;
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(255, 255, 255, 0.8);
            flex-direction: column;
            align-items: center;
            justify-content: center;
            z-index: 10;
        }
        
        .spinner {
            border: 4px solid rgba(0, 0, 0, 0.1);
            border-radius: 50%;
            border-top: 4px solid #2c7be5;
            width: 40px;
            height: 40px;
            animation: spin 1s linear infinite;
            margin-bottom: 15px;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        /* Toast notifications */
        .toast {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: #12263f;
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            display: flex;
            align-items: center;
            justify-content: space-between;
            max-width: 350px;
            opacity: 0;
            transform: translateY(20px);
            transition: all 0.3s ease;
            z-index: 3000;
        }
        
        .toast.show {
            opacity: 1;
            transform: translateY(0);
        }
        
        .toast-success {
            background: #00d97e;
        }
        
        .toast-error {
            background: #e63757;
        }
        
        .toast-info {
            background: #2c7be5;
        }
        
        .toast-alert {
            background: #f6c343;
            color: #12263f;
        }
        
        .toast-close {
            background: none;
            border: none;
            color: inherit;
            font-size: 1.2rem;
            margin-left: 15px;
            cursor: pointer;
            padding: 0 0 0 10px;
        }
        
        /* Error states */
        .form-group.error input,
        .form-group.error select,
        .form-group.error textarea {
            border-color: #e63757;
        }
        
        .error-message {
            color: #e63757;
            font-size: 0.85rem;
            margin-top: 5px;
            display: block;
        }
        
        /* Focus states for accessibility */
        button:focus, input:focus, select:focus, textarea:focus {
            outline: 2px solid #2c7be5;
            outline-offset: 2px;
        }
        
        /* Button loading states */
        .btn .fa-spinner {
            margin-right: 8px;
        }
    `;
    document.head.appendChild(style);
})();