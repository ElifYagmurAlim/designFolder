import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, HelpCircle, Mail, MessageSquare, BookOpen, Users, LayoutGrid, Edit } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const faqs = [
  {
    question: "What is CoParty Makers Club?",
    answer: "CoParty Makers Club is a meeting point that brings creative spirits together! Discover talented creators from different fields, find the most suitable collaborators for your projects instantly with AI-powered smart search, and create amazing things together."
  },
  {
    question: "How can I search?",
    answer: "The search bar on the main page is exactly for this! You can write the skill or type of collaboration you need here. For example, you can easily find anyone you want with specific searches like 'UI/UX designer for my mobile app project', 'React developer for website', or '3D modeling for game'."
  },
  {
    question: "Do I need to register to send messages?",
    answer: "Yes, you need to quickly create an account to message other creators and benefit from all interactive features of the platform. Remember, you don't need to register to search, you can start exploring immediately!"
  },
  {
    question: "Can I sign in with Google?",
    answer: "Yes, you can quickly sign in with your Google account. You can also register with email and password."
  },
  {
    question: "How can I edit my profile?",
    answer: "After signing in, you can go to your profile editing page by clicking the profile icon in the top right corner."
  },
  {
    question: "In which areas can I find creators?",
    answer: "Creators are here in every area that pushes the limits of your imagination! From software development to design, from art to crafts, from electronics to 3D printing, from music to game development, you can meet talented people in countless fields. In short, whatever you're looking for related to creating, you can find it here!"
  },
  {
    question: "What is the Board and how do I use it?",
    answer: "The Board is an area where community members can post listings and other users can view these listings. You can click the + icon in the top right to create a listing, browse existing listings, and message the owner of listings you're interested in. Users who haven't signed in can also view listings, but they need to sign in to send messages."
  },
  {
    question: "How can I edit or delete my own listing?",
    answer: "After signing in, when you click the + icon in the top right, if you have previously created a listing, it opens in a special card or modal. Here you can update or remove your listing using the 'Edit' and 'Delete' buttons. Each user can only create one listing at a time."
  },
  {
    question: "What are the message limits?",
    answer: "Free users can send 100 messages per day and 30 messages per user per day. Pro users get 500 daily messages and 100 messages per user per day. Message length is limited to 1500 characters for free users and 3000 characters for Pro users."
  },
  {
    question: "How does the chat system work?",
    answer: "Our chat system supports real-time messaging with read receipts, typing indicators, and offline message queuing. Messages are automatically saved and synchronized across devices. You can also minimize chat windows to continue browsing while chatting."
  },
  {
    question: "What is Pro membership and what are the benefits?",
    answer: "Pro membership offers enhanced features including higher message limits (500 daily vs 100), longer message length (3000 vs 1500 characters), priority support, and advanced search filters. Pro users also get early access to new features and exclusive community events."
  },
  {
    question: "How can I report inappropriate behavior?",
    answer: "If you encounter inappropriate behavior, harassment, or spam, please contact us immediately at support@coparty.club with details of the incident. We take all reports seriously and will investigate promptly to maintain a safe community environment."
  },
  {
    question: "Is my data secure and private?",
    answer: "Yes, we take data security and privacy seriously. All communications are encrypted, and we never share your personal information with third parties. You can control your privacy settings in your profile, and you can delete your account at any time."
  }
];

export default function HelpModal({ isOpen, onClose }: HelpModalProps) {
  const [activeTab, setActiveTab] = useState<'faq' | 'contact' | 'guide'>('faq');

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-[#0b0b0b] border border-[#333333] rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto mx-4"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
        >
          <div className="p-6 border-b border-[#333333]">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">Help and Support</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-[#1a1a1a] rounded-lg transition-colors text-[#cccccc] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Tabs */}
            <div className="flex gap-1 mt-4 p-1 bg-[#111111] rounded-lg">
              <button
                onClick={() => setActiveTab('faq')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors font-medium ${
                  activeTab === 'faq' ? 'bg-[#316afd] text-white' : 'text-[#aaaaaa] hover:text-white'
                }`}
              >
                <HelpCircle className="w-4 h-4" />
                FAQ
              </button>
              <button
                onClick={() => setActiveTab('guide')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors font-medium ${
                  activeTab === 'guide' ? 'bg-[#316afd] text-white' : 'text-[#aaaaaa] hover:text-white'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                Guide
              </button>
              <button
                onClick={() => setActiveTab('contact')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors font-medium ${
                  activeTab === 'contact' ? 'bg-[#316afd] text-white' : 'text-[#aaaaaa] hover:text-white'
                }`}
              >
                <Mail className="w-4 h-4" />
                Contact
              </button>
            </div>
          </div>

          <div className="p-6">
            {/* FAQ Tab */}
            {activeTab === 'faq' && (
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <div key={index} className="bg-[#111111] rounded-lg p-4">
                    <h3 className="font-semibold text-white mb-2">{faq.question}</h3>
                    <p className="text-[#aaaaaa] text-sm">{faq.answer}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Guide Tab */}
            {activeTab === 'guide' && (
              <div className="space-y-6">
                {/* Semantic search feature explanation */}
                <div className="bg-[#316afd]/10 border-l-4 border-[#316afd] p-4 rounded mb-6">
                  AI-Powered Smart Search: Why is it different? When you search in CoParty Makers Club, profiles are intelligently ranked not just by keywords, but by meaning! On each creator's card, you'll see a special note explaining why they're suitable for what you're looking for. If you haven't signed in yet, this explanation is based on the search query, if you have signed in, it's personalized based on your own profile information. This way you find truly the most suitable collaborators for you!
                </div>
                <div className="bg-[#111111] rounded-lg p-4">
                  <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    First Steps to Get Started
                  </h3>
                  <ol className="space-y-2 text-sm text-[#aaaaaa]">
                    <li>1. Search on the main page to discover profiles suitable for you.</li>
                    <li>2. Click on profiles you're interested in to see details.</li>
                    <li>3. Easily create an account to send messages.</li>
                    <li>4. Edit your own profile to increase your visibility.</li>
                  </ol>
                </div>
                
                <div className="bg-[#111111] rounded-lg p-4">
                  <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    Reach the Right Collaborations with Effective Communication
                  </h3>
                  <ul className="space-y-2 text-sm text-[#aaaaaa]">
                    <li>• Read profile details carefully and prepare personalized, sincere messages.</li>
                    <li>• Express project details clearly and in plain language.</li>
                    <li>• Emphasize potential collaborations that will provide mutual benefit.</li>
                    <li>• Always use professional and polite language.</li>
                  </ul>
                </div>

                <div className="bg-[#111111] rounded-lg p-4">
                  <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                    <LayoutGrid className="w-5 h-5" />
                    Board: Post Your Listing, Find Collaborations!
                  </h3>
                  <ul className="space-y-2 text-sm text-[#aaaaaa]">
                    <li>• You can easily create your listing by clicking the + icon in the top right.</li>
                    <li>• You can view other users' listings and examine their details.</li>
                    <li>• You just need to sign in to the platform to message the listing owner.</li>
                    <li>• Remember, each user can only create one listing at a time.</li>
                  </ul>
                </div>

                <div className="bg-[#111111] rounded-lg p-4">
                  <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                    <Edit className="w-5 h-5" />
                    Managing Your Listing is Very Easy!
                  </h3>
                  <ul className="space-y-2 text-sm text-[#aaaaaa]">
                    <li>• When you click the + icon in the top right, you can immediately see the listing you created before.</li>
                    <li>• You can update or remove your listing using the 'Edit' and 'Delete' buttons on the opened card.</li>
                    <li>• Each user can only create one listing at a time.</li>
                  </ul>
                </div>

                <div className="bg-[#111111] rounded-lg p-4">
                  <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    Chat System Best Practices
                  </h3>
                  <ul className="space-y-2 text-sm text-[#aaaaaa]">
                    <li>• Use the chat dock at the bottom right to manage multiple conversations.</li>
                    <li>• Minimize chat windows to continue browsing while chatting.</li>
                    <li>• Messages are automatically saved and synced across devices.</li>
                    <li>• Respect message limits: 100 daily messages for free users, 500 for Pro users.</li>
                    <li>• Keep messages professional and concise for better collaboration.</li>
                  </ul>
                </div>

                <div className="bg-[#111111] rounded-lg p-4">
                  <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Profile Optimization Tips
                  </h3>
                  <ul className="space-y-2 text-sm text-[#aaaaaa]">
                    <li>• Add a clear profile picture to increase trust and visibility.</li>
                    <li>• Write a compelling bio that highlights your unique skills and experience.</li>
                    <li>• Include specific skills and technologies you work with.</li>
                    <li>• Add portfolio links or examples of your work.</li>
                    <li>• Keep your profile updated with your latest projects and achievements.</li>
                    <li>• Use relevant keywords in your bio to improve search visibility.</li>
                  </ul>
                </div>

                <div className="bg-[#111111] rounded-lg p-4">
                  <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                    <LayoutGrid className="w-5 h-5" />
                    Effective Collaboration Strategies
                  </h3>
                  <ul className="space-y-2 text-sm text-[#aaaaaa]">
                    <li>• Research profiles thoroughly before reaching out.</li>
                    <li>• Be specific about your project requirements and timeline.</li>
                    <li>• Offer clear value propositions for potential collaborators.</li>
                    <li>• Use video calls for complex project discussions.</li>
                    <li>• Set clear expectations and milestones from the start.</li>
                    <li>• Maintain regular communication throughout the project.</li>
                  </ul>
                </div>

                <div className="bg-[#316afd]/10 border-l-4 border-[#316afd] p-4 rounded">
                  <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                    <span className="text-[#316afd]">💎</span>
                    Pro Tips for Power Users
                  </h3>
                  <ul className="space-y-2 text-sm text-[#aaaaaa]">
                    <li>• Use advanced search filters to find the perfect collaborators.</li>
                    <li>• Leverage higher message limits to build deeper relationships.</li>
                    <li>• Take advantage of priority support for urgent matters.</li>
                    <li>• Participate in exclusive Pro community events.</li>
                    <li>• Get early access to new features and beta testing.</li>
                    <li>• Use longer message length to provide detailed project briefs.</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Contact Tab */}
            {activeTab === 'contact' && (
              <div className="space-y-6">
                <div className="bg-[#111111] rounded-lg p-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-[#316afd]" />
                      <a 
                        href="mailto:support@coparty.club" 
                        className="text-[#316afd] hover:text-[#3a76ff] font-medium transition-colors"
                      >
                        support@coparty.club
                      </a>
                    </div>
                    <div className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-[#316afd]" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                      </svg>
                      <a 
                        href="https://thisis.coparty.club" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-[#316afd] hover:text-[#3a76ff] font-medium transition-colors"
                      >
                        thisis.coparty.club
                      </a>
                    </div>
                  </div>
                  <p className="text-[#aaaaaa] text-sm mt-4">
                    You can reach us through the contact information above for your questions, feedback, or support requests.
                  </p>
                </div>

                <div className="bg-[#111111] rounded-lg p-4">
                  <h3 className="font-semibold text-white mb-3">Support Categories</h3>
                  <div className="space-y-2 text-sm text-[#aaaaaa]">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-[#316afd] rounded-full"></span>
                      <span>Technical issues and bug reports</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-[#316afd] rounded-full"></span>
                      <span>Account and authentication problems</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-[#316afd] rounded-full"></span>
                      <span>Feature requests and suggestions</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-[#316afd] rounded-full"></span>
                      <span>Privacy and security concerns</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-[#316afd] rounded-full"></span>
                      <span>Partnership and collaboration inquiries</span>
                    </div>
                  </div>
                </div>

                <div className="bg-[#316afd]/10 border-l-4 border-[#316afd] p-4 rounded">
                  <h4 className="font-medium text-white mb-2">Response Time</h4>
                  <p className="text-[#aaaaaa] text-sm">
                    We typically respond to support requests within 24 hours during business days. For urgent technical issues, please include "URGENT" in your email subject line.
                  </p>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}