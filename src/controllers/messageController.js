const Message = require('../models/Message');
const nodemailer = require('nodemailer');

const messageController = {
    // Create new message
    createMessage: async (req, res) => {
        try {
            const { name, email, subject, message, phone } = req.body;
            
            const newMessage = new Message({
                name,
                email,
                subject,
                message,
                phone: phone || '',
                status: 'unread',
                priority: 'medium'
            });
            
            await newMessage.save();
            
            // Send email notification to admin
            await sendEmailNotification(newMessage);
            
            res.json({ 
                success: true, 
                message: 'Message sent successfully. We will get back to you soon!' 
            });
        } catch (error) {
            console.error('Error creating message:', error);
            res.status(500).json({ 
                success: false, 
                message: 'Error sending message. Please try again.' 
            });
        }
    },

    // Get all messages (admin)
    getAllMessages: async (req, res) => {
        try {
            const messages = await Message.find().sort({ createdAt: -1 });
            res.json({ success: true, messages });
        } catch (error) {
            console.error('Error getting messages:', error);
            res.status(500).json({ success: false, message: 'Error retrieving messages' });
        }
    },

    // Get unread messages count
    getUnreadCount: async (req, res) => {
        try {
            const count = await Message.countDocuments({ status: 'unread' });
            res.json({ success: true, count });
        } catch (error) {
            console.error('Error getting unread count:', error);
            res.status(500).json({ success: false, message: 'Error retrieving count' });
        }
    },

    // Mark message as read
    markAsRead: async (req, res) => {
        try {
            const message = await Message.findByIdAndUpdate(
                req.params.id,
                { status: 'read' },
                { new: true }
            );
            
            if (!message) {
                return res.status(404).json({ success: false, message: 'Message not found' });
            }
            
            res.json({ success: true, message: 'Message marked as read' });
        } catch (error) {
            console.error('Error marking message as read:', error);
            res.status(500).json({ success: false, message: 'Error updating message' });
        }
    },

    // Reply to message
    replyToMessage: async (req, res) => {
        try {
            const { replyText } = req.body;
            
            const message = await Message.findByIdAndUpdate(
                req.params.id,
                {
                    status: 'replied',
                    reply: {
                        text: replyText,
                        date: new Date(),
                        repliedBy: 'Admin'
                    }
                },
                { new: true }
            );
            
            if (!message) {
                return res.status(404).json({ success: false, message: 'Message not found' });
            }
            
            // Send reply email
            await sendReplyEmail(message.email, replyText);
            
            res.json({ success: true, message: 'Reply sent successfully' });
        } catch (error) {
            console.error('Error replying to message:', error);
            res.status(500).json({ success: false, message: 'Error sending reply' });
        }
    },

    // Delete message
    deleteMessage: async (req, res) => {
        try {
            const message = await Message.findByIdAndDelete(req.params.id);
            
            if (!message) {
                return res.status(404).json({ success: false, message: 'Message not found' });
            }
            
            res.json({ success: true, message: 'Message deleted successfully' });
        } catch (error) {
            console.error('Error deleting message:', error);
            res.status(500).json({ success: false, message: 'Error deleting message' });
        }
    },

    // Get message by ID
    getMessageById: async (req, res) => {
        try {
            const message = await Message.findById(req.params.id);
            
            if (!message) {
                return res.status(404).json({ success: false, message: 'Message not found' });
            }
            
            res.json({ success: true, message });
        } catch (error) {
            console.error('Error getting message:', error);
            res.status(500).json({ success: false, message: 'Error retrieving message' });
        }
    },

    // Bulk actions
    bulkDelete: async (req, res) => {
        try {
            const { messageIds } = req.body;
            
            await Message.deleteMany({ _id: { $in: messageIds } });
            
            res.json({ success: true, message: 'Messages deleted successfully' });
        } catch (error) {
            console.error('Error bulk deleting messages:', error);
            res.status(500).json({ success: false, message: 'Error deleting messages' });
        }
    },

    bulkMarkAsRead: async (req, res) => {
        try {
            const { messageIds } = req.body;
            
            await Message.updateMany(
                { _id: { $in: messageIds } },
                { status: 'read' }
            );
            
            res.json({ success: true, message: 'Messages marked as read' });
        } catch (error) {
            console.error('Error bulk marking messages as read:', error);
            res.status(500).json({ success: false, message: 'Error updating messages' });
        }
    }
};

// Helper function to send email notification
async function sendEmailNotification(message) {
    try {
        // Create transporter (configure with your email service)
        const transporter = nodemailer.createTransporter({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER || 'your-email@gmail.com',
                pass: process.env.EMAIL_PASS || 'your-app-password'
            }
        });
        
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: 'admin@ntandostore.com',
            subject: `New Contact Message: ${message.subject}`,
            html: `
                <h2>New Contact Message</h2>
                <p><strong>From:</strong> ${message.name} (${message.email})</p>
                <p><strong>Phone:</strong> ${message.phone || 'Not provided'}</p>
                <p><strong>Subject:</strong> ${message.subject}</p>
                <p><strong>Message:</strong></p>
                <p>${message.message}</p>
                <p><strong>Date:</strong> ${message.createdAt}</p>
            `
        };
        
        await transporter.sendMail(mailOptions);
        console.log('Email notification sent successfully');
    } catch (error) {
        console.error('Error sending email notification:', error);
    }
}

// Helper function to send reply email
async function sendReplyEmail(toEmail, replyText) {
    try {
        const transporter = nodemailer.createTransporter({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER || 'your-email@gmail.com',
                pass: process.env.EMAIL_PASS || 'your-app-password'
            }
        });
        
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: toEmail,
            subject: 'Reply from NtandoStore v7',
            html: `
                <h2>Reply from NtandoStore v7</h2>
                <p>${replyText}</p>
                <p>Best regards,<br>NtandoStore v7 Team</p>
            `
        };
        
        await transporter.sendMail(mailOptions);
        console.log('Reply email sent successfully');
    } catch (error) {
        console.error('Error sending reply email:', error);
    }
}

module.exports = messageController;