// Enhanced BuildNest Dashboard JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize application
    initializeApp();
    
    function initializeApp() {
        setupTabNavigation();
        setupCreateProjectForm();
        setupProjectFiltering();
        setupApplicationsSection();
        setupCommunitySection();
        setupMessagingSystem();
        setupProfileSection();
        setupNotifications();
        setupModals();
        setupKeyboardShortcuts();
        setupProgressAnimations();
        setupHeaderActions();
    }
    
    // Tab Navigation System
    function setupTabNavigation() {
        const tabTriggers = document.querySelectorAll('.tab-trigger');
        const tabContents = document.querySelectorAll('.tab-content');
        let activeTab = 'overview';
        
        function switchTab(tabName) {
            // Remove active class from all triggers and contents
            tabTriggers.forEach(trigger => trigger.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to selected trigger and content
            const selectedTrigger = document.querySelector(`[data-tab="${tabName}"]`);
            const selectedContent = document.getElementById(tabName);
            
            if (selectedTrigger && selectedContent) {
                selectedTrigger.classList.add('active');
                selectedContent.classList.add('active');
                activeTab = tabName;
                
                // Update URL hash
                window.location.hash = tabName;
                
                // Trigger tab-specific animations
                if (tabName === 'projects') {
                    setTimeout(animateProgressBars, 300);
                }
            }
        }
        
        // Add click event listeners to tab triggers
        tabTriggers.forEach(trigger => {
            trigger.addEventListener('click', function() {
                const tabName = this.getAttribute('data-tab');
                switchTab(tabName);
            });
        });
        
        // Handle hash navigation
        if (window.location.hash) {
            const hashTab = window.location.hash.substring(1);
            if (document.getElementById(hashTab)) {
                switchTab(hashTab);
            }
        }
        
        // Make switchTab globally available
        window.switchTab = switchTab;
    }
    
    // Header Actions
    function setupHeaderActions() {
        // Settings button
        const settingsBtn = document.getElementById('settings-btn');
        const settingsModal = document.getElementById('settings-modal');
        
        if (settingsBtn && settingsModal) {
            settingsBtn.addEventListener('click', function() {
                settingsModal.style.display = 'block';
            });
        }
        
        // Logout button
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', function() {
                if (confirm('Are you sure you want to logout?')) {
                    // Simulate logout
                    alert('Logged out successfully!');
                    // In a real app, this would redirect to login page
                    window.location.reload();
                }
            });
        }
        
        // Action buttons in header
        const actionBtns = document.querySelectorAll('.action-btn');
        actionBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const tabName = this.getAttribute('data-tab');
                if (tabName) {
                    window.switchTab(tabName);
                }
            });
        });
        
        // User profile click
        const userProfile = document.querySelector('.user-profile');
        if (userProfile) {
            userProfile.addEventListener('click', function() {
                window.switchTab('profile');
            });
        }
    }
    
    // Create Project Form
    function setupCreateProjectForm() {
        const createForm = document.querySelector('.create-form');
        if (!createForm) return;
        
        const collaborationSelect = document.getElementById('collaboration-type');
        const teamSizeGroup = document.getElementById('team-size-group');
        const techCheckboxes = document.querySelectorAll('.tech-category input[type="checkbox"]');
        
        // Show/hide team size based on collaboration type
        if (collaborationSelect && teamSizeGroup) {
            collaborationSelect.addEventListener('change', function() {
                if (this.value === 'collaborative') {
                    teamSizeGroup.style.display = 'block';
                } else {
                    teamSizeGroup.style.display = 'none';
                }
            });
        }
        
        // Handle form submission
        const createBtn = createForm.querySelector('.btn-primary');
        if (createBtn) {
            createBtn.addEventListener('click', function(e) {
                e.preventDefault();
                
                const projectName = document.getElementById('project-name').value;
                const projectDescription = document.getElementById('project-description').value;
                const projectType = document.getElementById('project-type').value;
                const developmentField = document.getElementById('development-field').value;
                const collaborationType = document.getElementById('collaboration-type').value;
                const difficultyLevel = document.getElementById('difficulty-level').value;
                const teamSize = document.getElementById('team-size').value;
                
                // Get selected technologies
                const selectedTech = Array.from(techCheckboxes)
                    .filter(cb => cb.checked)
                    .map(cb => cb.value);
                
                if (projectName && projectDescription) {
                    let message = `Project "${projectName}" created successfully!\n\n`;
                    message += `Type: ${projectType}\n`;
                    message += `Field: ${developmentField}\n`;
                    message += `Collaboration: ${collaborationType}\n`;
                    message += `Level: ${difficultyLevel}\n`;
                    if (collaborationType === 'collaborative') {
                        message += `Team Size: ${teamSize}\n`;
                    }
                    if (selectedTech.length > 0) {
                        message += `Technologies: ${selectedTech.join(', ')}\n`;
                    }
                    message += `\nDescription: ${projectDescription}`;
                    
                    alert(message);
                    
                    // Clear form
                    createForm.reset();
                    teamSizeGroup.style.display = 'none';
                    techCheckboxes.forEach(cb => cb.checked = false);
                    
                    // Switch to projects tab
                    window.switchTab('projects');
                } else {
                    alert('Please fill in all required fields.');
                }
            });
        }
    }
    
    // Project Filtering
    function setupProjectFiltering() {
        const collaborationFilter = document.getElementById('collaboration-filter');
        const fieldFilter = document.getElementById('field-filter');
        const difficultyFilter = document.getElementById('difficulty-filter');
        const projectCards = document.querySelectorAll('.project-card');
        
        function filterProjects() {
            const collaborationValue = collaborationFilter?.value || 'all';
            const fieldValue = fieldFilter?.value || 'all';
            const difficultyValue = difficultyFilter?.value || 'all';
            
            projectCards.forEach(card => {
                const cardCollaboration = card.getAttribute('data-collaboration');
                const cardField = card.getAttribute('data-field');
                const cardDifficulty = card.getAttribute('data-difficulty');
                
                let showCard = true;
                
                if (collaborationValue !== 'all' && cardCollaboration !== collaborationValue) {
                    showCard = false;
                }
                
                if (fieldValue !== 'all' && !cardField.includes(fieldValue)) {
                    showCard = false;
                }
                
                if (difficultyValue !== 'all' && cardDifficulty !== difficultyValue) {
                    showCard = false;
                }
                
                card.style.display = showCard ? 'block' : 'none';
            });
        }
        
        if (collaborationFilter) collaborationFilter.addEventListener('change', filterProjects);
        if (fieldFilter) fieldFilter.addEventListener('change', filterProjects);
        if (difficultyFilter) difficultyFilter.addEventListener('change', filterProjects);
    }
    
    // Applications Section
    function setupApplicationsSection() {
        setupApplicationTabs();
        setupApplicationActions();
        setupResponseViewing();
    }
    
    function setupApplicationTabs() {
        const appTabBtns = document.querySelectorAll('.app-tab-btn');
        const appTabContents = document.querySelectorAll('.app-tab-content');
        
        appTabBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const tabName = this.getAttribute('data-app-tab');
                
                // Remove active class from all buttons and contents
                appTabBtns.forEach(b => b.classList.remove('active'));
                appTabContents.forEach(content => content.classList.remove('active'));
                
                // Add active class to clicked button and corresponding content
                this.classList.add('active');
                const targetContent = document.getElementById(tabName);
                if (targetContent) {
                    targetContent.classList.add('active');
                }
            });
        });
    }
    
    function setupApplicationActions() {
        // Accept/Reject buttons for received applications
        const acceptBtns = document.querySelectorAll('.btn-accept');
        const rejectBtns = document.querySelectorAll('.btn-reject');
        
        acceptBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const applicationItem = this.closest('.application-item');
                const projectName = applicationItem.querySelector('h3').textContent;
                const applicantName = applicationItem.querySelector('p').textContent.split(' ')[0];
                
                // Show collaboration link and send email notification
                const collaborationLink = `https://buildnest-collab.com/projects/${projectName.toLowerCase().replace(/\s+/g, '-')}`;
                
                alert(`Application accepted!\n\n${applicantName} has been added to the "${projectName}" project.\n\nCollaboration link: ${collaborationLink}\n\nAn email with the collaboration details has been sent to ${applicantName}.`);
                
                // Replace buttons with accepted status and collaboration link
                const actionsDiv = this.parentElement;
                actionsDiv.innerHTML = `
                    <span class="status-badge accepted">Accepted</span>
                    <button class="btn-primary collaboration-link" onclick="window.open('${collaborationLink}', '_blank')">
                        View Collaboration
                    </button>
                `;
            });
        });
        
        rejectBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const applicationItem = this.closest('.application-item');
                const projectName = applicationItem.querySelector('h3').textContent;
                const applicantName = applicationItem.querySelector('p').textContent.split(' ')[0];
                
                if (confirm(`Are you sure you want to reject ${applicantName}'s application for "${projectName}"?`)) {
                    alert(`Application rejected.\n\n${applicantName}'s application has been declined.\nA notification email has been sent.`);
                    
                    // Replace buttons with rejected status
                    const actionsDiv = this.parentElement;
                    actionsDiv.innerHTML = '<span class="status-badge rejected">Rejected</span>';
                }
            });
        });
    }
    
    function setupResponseViewing() {
        // View response buttons for sent applications
        const viewResponseBtns = document.querySelectorAll('.view-response-btn');
        
        viewResponseBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const response = this.getAttribute('data-response');
                const applicationItem = this.closest('.application-item');
                const projectName = applicationItem.querySelector('h3').textContent;
                
                let responseMessage = '';
                switch(response) {
                    case 'pending':
                        responseMessage = `Your application for "${projectName}" is still under review.\n\nStatus: Pending\nSubmitted: 2 days ago\n\nThe project owner will review your application and respond soon.`;
                        break;
                    case 'accepted':
                        responseMessage = `Congratulations! Your application for "${projectName}" has been accepted.\n\nStatus: Accepted\nAccepted: 1 week ago\n\nMessage from project owner:\n"Welcome to the team! Your React experience is exactly what we need. Looking forward to working with you."`;
                        break;
                    case 'rejected':
                        responseMessage = `Your application for "${projectName}" was not accepted.\n\nStatus: Rejected\nDeclined: 2 weeks ago\n\nMessage from project owner:\n"Thank you for your interest. We've decided to go with candidates who have more experience with Vue.js for this particular project."`;
                        break;
                }
                
                alert(responseMessage);
            });
        });
        
        // View applicant response buttons for received applications
        const viewApplicantBtns = document.querySelectorAll('.view-applicant-response');
        
        viewApplicantBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const applicationItem = this.closest('.application-item');
                const projectName = applicationItem.querySelector('h3').textContent;
                const applicantName = applicationItem.querySelector('p').textContent.split(' ')[0];
                
                const applicationDetails = `Application Details for "${projectName}"\n\nApplicant: ${applicantName}\nSubmitted: 1 day ago\n\nWhy they want to join:\n"I'm excited about this project because it aligns perfectly with my passion for mobile development. I have 3 years of experience with React Native and have built several task management apps before. I'm particularly interested in the real-time collaboration features and would love to contribute to the offline support implementation."\n\nRelevant Skills:\nReact Native, Firebase, Redux, JavaScript, TypeScript, Git\n\nPortfolio: https://alexrodriguez.dev`;
                
                alert(applicationDetails);
            });
        });
        
        // Collaboration link buttons
        const collaborationBtns = document.querySelectorAll('.collaboration-link');
        
        collaborationBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const projectName = this.getAttribute('data-project');
                const collaborationUrl = `https://buildnest-collab.com/projects/${projectName.toLowerCase().replace(/\s+/g, '-')}`;
                
                // Simulate opening collaboration platform
                alert(`Opening collaboration platform for "${projectName}"...\n\nURL: ${collaborationUrl}\n\nFeatures available:\n• Real-time code collaboration\n• Task management\n• Video calls\n• File sharing\n• Progress tracking`);
                
                // In a real app, this would open the collaboration platform
                // window.open(collaborationUrl, '_blank');
            });
        });
    }
    
    // Community Section
    function setupCommunitySection() {
        setupExpandableSections();
        setupCommunityInteractions();
    }
    
    function setupExpandableSections() {
        const expandableHeaders = document.querySelectorAll('.section-header.expandable');
        
        expandableHeaders.forEach(header => {
            header.addEventListener('click', function() {
                const targetId = this.getAttribute('data-target');
                const targetContent = document.getElementById(targetId);
                const toggleIcon = this.querySelector('.toggle-icon');
                
                if (targetContent) {
                    if (targetContent.classList.contains('expanded')) {
                        targetContent.classList.remove('expanded');
                        targetContent.style.display = 'none';
                        this.classList.remove('expanded');
                    } else {
                        targetContent.classList.add('expanded');
                        targetContent.style.display = 'block';
                        this.classList.add('expanded');
                    }
                }
            });
        });
    }
    
    function setupCommunityInteractions() {
        // Connect buttons
        const connectBtns = document.querySelectorAll('.connect-btn');
        
        connectBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const memberCard = this.closest('.member-card');
                const memberName = memberCard.querySelector('h4').textContent;
                
                alert(`Connection request sent to ${memberName}!\n\nThey will be notified and can accept your connection request. Once connected, you can:\n• Send direct messages\n• Collaborate on projects\n• Share resources\n• Get recommendations`);
                
                this.textContent = 'Pending';
                this.disabled = true;
                this.style.background = '#6b7280';
            });
        });
        
        // Discussion interactions
        const discussionItems = document.querySelectorAll('.discussion-item');
        
        discussionItems.forEach(item => {
            item.addEventListener('click', function() {
                const title = this.querySelector('h4').textContent;
                const author = this.querySelector('.author-info h4').textContent;
                const content = this.querySelector('p').textContent;
                
                alert(`Discussion: ${title}\n\nBy: ${author}\n\n${content}\n\nClick to join the discussion and share your thoughts!`);
            });
        });
    }
    
    // Messaging System
    function setupMessagingSystem() {
        setupConversationSwitching();
        setupMessageSending();
    }
    
    function setupConversationSwitching() {
        const conversationItems = document.querySelectorAll('.conversation-item');
        
        conversationItems.forEach(item => {
            item.addEventListener('click', function() {
                // Remove active class from all conversations
                conversationItems.forEach(conv => conv.classList.remove('active'));
                
                // Add active class to clicked conversation
                this.classList.add('active');
                
                // Remove unread badge
                const unreadBadge = this.querySelector('.unread-badge');
                if (unreadBadge) {
                    unreadBadge.remove();
                }
                
                // Update chat header and messages based on conversation
                const conversationId = this.getAttribute('data-conversation');
                updateChatArea(conversationId);
            });
        });
    }
    
    function updateChatArea(conversationId) {
        const chatHeader = document.querySelector('.chat-user-info');
        const chatMessages = document.querySelector('.chat-messages');
        
        // Sample conversation data
        const conversations = {
            emma: {
                name: 'Emma Davis',
                avatar: 'ED',
                status: 'Online',
                messages: [
                    { type: 'received', content: 'Hi Thabang! Thanks for applying to join our portfolio project. Your experience with React looks perfect for what we need.', time: '2 hours ago' },
                    { type: 'sent', content: 'Thank you Emma! I\'m excited to contribute to the project. When can we schedule a kickoff meeting?', time: '1 hour ago' },
                    { type: 'received', content: 'How about tomorrow at 2 PM? We can discuss the project structure and divide the tasks.', time: '30 minutes ago' }
                ]
            },
            michael: {
                name: 'Michael Chen',
                avatar: 'MC',
                status: 'Online',
                messages: [
                    { type: 'received', content: 'Welcome to the AI Chat Bot team! I\'ve added you to our project workspace.', time: '1 day ago' },
                    { type: 'sent', content: 'Thanks Michael! I\'m looking forward to working on the natural language processing features.', time: '1 day ago' }
                ]
            },
            sarah: {
                name: 'Sarah Johnson',
                avatar: 'SJ',
                status: 'Away',
                messages: [
                    { type: 'received', content: 'Great work on the mobile app design! The UI mockups look fantastic.', time: '3 days ago' },
                    { type: 'sent', content: 'Thank you! I\'ve also prepared some interactive prototypes. Should I share them in our next meeting?', time: '3 days ago' }
                ]
            }
        };
        
        const conversation = conversations[conversationId];
        if (!conversation) return;
        
        // Update header
        if (chatHeader) {
            chatHeader.innerHTML = `
                <div class="chat-avatar">${conversation.avatar}</div>
                <div>
                    <h4>${conversation.name}</h4>
                    <small>${conversation.status}</small>
                </div>
            `;
        }
        
        // Update messages
        if (chatMessages) {
            chatMessages.innerHTML = conversation.messages.map(msg => `
                <div class="message ${msg.type}">
                    ${msg.type === 'received' ? `<div class="message-avatar">${conversation.avatar}</div>` : ''}
                    <div class="message-content">
                        <p>${msg.content}</p>
                        <small>${msg.time}</small>
                    </div>
                </div>
            `).join('');
            
            // Scroll to bottom
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
    }
    
    function setupMessageSending() {
        const messageInput = document.getElementById('message-input');
        const sendBtn = document.querySelector('.send-btn');
        const chatMessages = document.querySelector('.chat-messages');
        
        function sendMessage() {
            const messageText = messageInput.value.trim();
            if (!messageText) return;
            
            // Add message to chat
            const messageElement = document.createElement('div');
            messageElement.className = 'message sent';
            messageElement.innerHTML = `
                <div class="message-content">
                    <p>${messageText}</p>
                    <small>Just now</small>
                </div>
            `;
            
            if (chatMessages) {
                chatMessages.appendChild(messageElement);
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }
            
            // Clear input
            messageInput.value = '';
            
            // Simulate response (in a real app, this would be handled by the server)
            setTimeout(() => {
                const responseElement = document.createElement('div');
                responseElement.className = 'message received';
                responseElement.innerHTML = `
                    <div class="message-avatar">ED</div>
                    <div class="message-content">
                        <p>Thanks for the message! I'll get back to you soon.</p>
                        <small>Just now</small>
                    </div>
                `;
                
                if (chatMessages) {
                    chatMessages.appendChild(responseElement);
                    chatMessages.scrollTop = chatMessages.scrollHeight;
                }
            }, 1000);
        }
        
        if (sendBtn) {
            sendBtn.addEventListener('click', sendMessage);
        }
        
        if (messageInput) {
            messageInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    sendMessage();
                }
            });
        }
    }
    
    // Profile Section
    function setupProfileSection() {
        setupSkillsEditing();
        setupFrameworksEditing();
        setupDescriptionEditing();
    }
    
    function setupSkillsEditing() {
        const editSkillsBtn = document.querySelector('.edit-skills');
        
        if (editSkillsBtn) {
            editSkillsBtn.addEventListener('click', function() {
                const skillsContainer = document.querySelector('.skills-container');
                const currentSkills = Array.from(skillsContainer.querySelectorAll('.skill-tag'))
                    .map(tag => tag.textContent);
                
                const newSkills = prompt('Edit your IT skills (comma-separated):', currentSkills.join(', '));
                
                if (newSkills !== null) {
                    const skillsArray = newSkills.split(',').map(skill => skill.trim()).filter(skill => skill);
                    
                    // Update skills display
                    const skillTags = skillsArray.map(skill => `<span class="skill-tag">${skill}</span>`).join('');
                    skillsContainer.innerHTML = skillTags + '<button class="btn-small edit-skills">Edit Skills</button>';
                    
                    // Re-attach event listener
                    setupSkillsEditing();
                }
            });
        }
    }
    
    function setupFrameworksEditing() {
        const editFrameworksBtn = document.querySelector('.edit-frameworks');
        
        if (editFrameworksBtn) {
            editFrameworksBtn.addEventListener('click', function() {
                const frameworksContainer = document.querySelector('.frameworks-container');
                const currentFrameworks = Array.from(frameworksContainer.querySelectorAll('.framework-tag'))
                    .map(tag => tag.textContent);
                
                const newFrameworks = prompt('Edit your frameworks & technologies (comma-separated):', currentFrameworks.join(', '));
                
                if (newFrameworks !== null) {
                    const frameworksArray = newFrameworks.split(',').map(fw => fw.trim()).filter(fw => fw);
                    
                    // Update frameworks display
                    const frameworkTags = frameworksArray.map(fw => `<span class="framework-tag">${fw}</span>`).join('');
                    frameworksContainer.innerHTML = frameworkTags + '<button class="btn-small edit-frameworks">Edit Frameworks</button>';
                    
                    // Re-attach event listener
                    setupFrameworksEditing();
                }
            });
        }
    }
    
    function setupDescriptionEditing() {
        const editDescriptionBtn = document.querySelector('.edit-description');
        
        if (editDescriptionBtn) {
            editDescriptionBtn.addEventListener('click', function() {
                const descriptionP = document.querySelector('.description-content p');
                const currentText = descriptionP.textContent;
                
                const newDescription = prompt('Edit your description:', currentText);
                if (newDescription && newDescription.trim() !== '') {
                    descriptionP.textContent = newDescription;
                }
            });
        }
    }
    
    // Notifications
    function setupNotifications() {
        const notificationViewBtns = document.querySelectorAll('.notifications-list .btn-small');
        
        notificationViewBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const notificationItem = this.closest('.notification-item');
                const title = notificationItem.querySelector('h4').textContent;
                const content = notificationItem.querySelector('p').textContent;
                
                alert(`${title}\n\n${content}`);
                
                // Mark as read
                notificationItem.classList.remove('unread');
            });
        });
        
        // Update notification count when viewing notifications tab
        const notificationsTab = document.querySelector('[data-tab="notifications"]');
        if (notificationsTab) {
            notificationsTab.addEventListener('click', function() {
                setTimeout(() => {
                    const badges = document.querySelectorAll('.notification-badge');
                    badges.forEach(badge => {
                        if (badge.textContent !== '0') {
                            badge.textContent = '0';
                            badge.style.display = 'none';
                        }
                    });
                }, 500);
            });
        }
    }
    
    // Modal System
    function setupModals() {
        const modals = document.querySelectorAll('.modal');
        const closeModalBtns = document.querySelectorAll('.close-modal');
        const viewMoreBtns = document.querySelectorAll('.view-more-btn');
        
        // Project modal
        const projectModal = document.getElementById('project-modal');
        
        viewMoreBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const projectCard = this.closest('.project-card');
                const projectTitle = projectCard.querySelector('h3').textContent;
                const projectDescription = projectCard.querySelector('p').textContent;
                
                // Populate modal with project data
                if (projectModal) {
                    document.getElementById('modal-project-title').textContent = projectTitle;
                    document.getElementById('modal-project-description').textContent = projectDescription;
                    projectModal.style.display = 'block';
                }
            });
        });
        
        // Close modal functionality
        closeModalBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const modal = this.closest('.modal');
                if (modal) {
                    modal.style.display = 'none';
                }
            });
        });
        
        // Close modal when clicking outside
        window.addEventListener('click', function(event) {
            modals.forEach(modal => {
                if (event.target === modal) {
                    modal.style.display = 'none';
                }
            });
        });
        
        // Detail tabs in modal
        setupDetailTabs();
    }
    
    function setupDetailTabs() {
        const detailTabBtns = document.querySelectorAll('.detail-tab-btn');
        const detailTabContents = document.querySelectorAll('.detail-tab-content');
        
        detailTabBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const tabName = this.getAttribute('data-detail-tab');
                
                // Remove active class from all buttons and contents
                detailTabBtns.forEach(b => b.classList.remove('active'));
                detailTabContents.forEach(content => content.classList.remove('active'));
                
                // Add active class to clicked button and corresponding content
                this.classList.add('active');
                const targetContent = document.getElementById(tabName + '-detail');
                if (targetContent) {
                    targetContent.classList.add('active');
                }
            });
        });
    }
    
    // Keyboard Shortcuts
    function setupKeyboardShortcuts() {
        document.addEventListener('keydown', function(e) {
            // Alt + number keys for tab switching
            if (e.altKey) {
                const tabMap = {
                    '1': 'overview',
                    '2': 'profile',
                    '3': 'create',
                    '4': 'projects',
                    '5': 'applications',
                    '6': 'community',
                    '7': 'messages',
                    '8': 'portfolio',
                    '9': 'notifications'
                };
                
                if (tabMap[e.key]) {
                    e.preventDefault();
                    window.switchTab(tabMap[e.key]);
                }
            }
            
            // Escape key to close modals
            if (e.key === 'Escape') {
                const openModals = document.querySelectorAll('.modal[style*="block"]');
                openModals.forEach(modal => {
                    modal.style.display = 'none';
                });
            }
        });
    }
    
    // Progress Bar Animations
    function setupProgressAnimations() {
        // Make animateProgressBars globally available
        window.animateProgressBars = animateProgressBars;
    }
    
    function animateProgressBars() {
        const progressBars = document.querySelectorAll('.progress-fill');
        progressBars.forEach(bar => {
            const width = bar.style.width;
            bar.style.width = '0%';
            setTimeout(() => {
                bar.style.width = width;
            }, 100);
        });
    }
    
    // Portfolio functionality
    const portfolioEditBtn = document.querySelector('.portfolio-section .btn-primary');
    if (portfolioEditBtn) {
        portfolioEditBtn.addEventListener('click', function() {
            alert('Portfolio editor would open here. This would allow you to:\n\n• Add/edit projects\n• Update skills and experience\n• Customize layout and design\n• Preview your portfolio\n• Publish to custom URL\n• Generate PDF resume');
        });
    }
    
    // Settings modal functionality
    const settingsModal = document.getElementById('settings-modal');
    if (settingsModal) {
        const saveSettingsBtn = settingsModal.querySelector('.btn-primary');
        if (saveSettingsBtn) {
            saveSettingsBtn.addEventListener('click', function() {
                alert('Settings saved successfully!');
                settingsModal.style.display = 'none';
            });
        }
    }
    
    // Real-time updates simulation
    function simulateRealTimeUpdates() {
        setInterval(() => {
            // Simulate notification updates
            const notificationBadges = document.querySelectorAll('.notification-badge');
            notificationBadges.forEach(badge => {
                if (Math.random() > 0.98 && badge.style.display !== 'none') {
                    const currentCount = parseInt(badge.textContent) || 0;
                    badge.textContent = currentCount + 1;
                    badge.style.display = 'flex';
                }
            });
        }, 30000); // Check every 30 seconds
    }
    
    // Initialize real-time features
    simulateRealTimeUpdates();
    
    // Add smooth scrolling
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // Initialize expanded sections (show discussions and members by default)
    setTimeout(() => {
        const discussionsHeader = document.querySelector('[data-target="discussions-content"]');
        const membersHeader = document.querySelector('[data-target="members-content"]');
        
        if (discussionsHeader) discussionsHeader.click();
        if (membersHeader) membersHeader.click();
    }, 500);
});

// Global utility functions
window.BuildNestApp = {
    // Data management
    data: {
        user: {
            name: 'Thabang Lekuleni',
            email: 'thabang.lekuleni@example.com',
            avatar: 'TL',
            joinDate: 'January 2024',
            description: 'Passionate full-stack developer with 5+ years of experience in building scalable web applications. Specializing in React, Node.js, and cloud technologies. Always eager to collaborate on innovative projects and mentor aspiring developers.',
            skills: ['JavaScript', 'Python', 'Java', 'SQL', 'HTML/CSS', 'Git', 'Docker', 'AWS'],
            frameworks: ['React', 'Node.js', 'Express', 'MongoDB', 'PostgreSQL', 'Django', 'Spring Boot', 'Vue.js'],
            linkedin: 'https://linkedin.com/in/thabang-lekuleni',
            github: 'https://github.com/thabang-lekuleni'
        }
    },
    
    // Utility functions
    utils: {
        formatDate: function(date) {
            return new Date(date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        },
        
        generateId: function() {
            return Date.now().toString(36) + Math.random().toString(36).substr(2);
        },
        
        debounce: function(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        }
    }
};