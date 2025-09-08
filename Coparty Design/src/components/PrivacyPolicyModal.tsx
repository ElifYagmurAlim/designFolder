import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Shield, Mail, MapPin, Globe } from "lucide-react";

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept?: () => void;
  onDecline?: () => void;
}

export default function PrivacyPolicyModal({ isOpen, onClose, onAccept, onDecline }: PrivacyPolicyModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-[#0b0b0b] border border-[#333333] rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto mx-4"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6 border-b border-[#333333]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Shield className="w-6 h-6 text-[#316afd]" />
                <h2 className="text-xl font-semibold text-white">Privacy Policy</h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-[#1a1a1a] rounded-lg transition-colors text-[#cccccc] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="p-6">
            <div className="space-y-4 text-[#aaaaaa]">
              {/* Introduction */}
              <p className="text-sm mb-4 bg-[#111111] rounded-lg p-4">
                This Privacy Policy has been prepared to inform you about the processing of your personal data by CoParty Makers Club ("Platform"). Your data security is important to us.
              </p>
              
              {/* Data Controller */}
              <section className="bg-[#111111] rounded-lg p-4">
                <h3 className="text-lg font-semibold text-white mb-3">
                  1. Data Controller Identity (Who We Are)
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <strong className="text-white">Name:</strong> Volkan Çetin
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#316afd]" />
                    <strong className="text-white">Address:</strong> Istanbul, Turkey
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-[#316afd]" />
                    <strong className="text-white">Email:</strong> support@coparty.club
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-[#316afd]" />
                    <strong className="text-white">Website:</strong> coparty.club
                  </div>
                </div>
              </section>

              {/* Purpose */}
              <section className="bg-[#111111] rounded-lg p-4">
                <h3 className="text-lg font-semibold text-white mb-3">
                  2. Purposes of Processing Personal Data
                </h3>
                <p className="text-sm mb-2">
                  Your personal data is processed for the following purposes:
                </p>
                <ul className="text-sm space-y-1 ml-4">
                  <li>• Account creation and user authentication</li>
                  <li>• Provision and management of platform services</li>
                  <li>• Communication and messaging between users</li>
                  <li>• Profile creation and community features</li>
                  <li>• Security and fraud prevention</li>
                  <li>• Compliance with legal obligations</li>
                  <li>• Service quality improvement and analytics</li>
                  <li>• Marketing and communication activities (with your consent)</li>
                </ul>
              </section>

              {/* Data Transfer */}
              <section className="bg-[#111111] rounded-lg p-4">
                <h3 className="text-lg font-semibold text-white mb-3">
                  3. To Whom and For What Purpose Data May Be Transferred
                </h3>
                <p className="text-sm mb-2">
                  Personal data may be shared with third parties in the following cases:
                </p>
                <ul className="text-sm space-y-1 ml-4">
                  <li>• <strong>Service Providers:</strong> Our partners providing the platform's technical infrastructure and operations such as Firebase, Google, Vercel, and other cloud services.</li>
                  <li>• <strong>Legal Obligation:</strong> Competent public authorities as required by applicable laws and regulations.</li>
                  <li>• <strong>Security:</strong> Relevant institutions to ensure platform security, prevent fraud, and investigate violations.</li>
                  <li>• <strong>Business Partners:</strong> Trusted partners to improve service quality and offer new features (only with your explicit consent).</li>
                  <li>• <strong>Analytics Services:</strong> Anonymous usage data for service improvement and user experience optimization.</li>
                </ul>
              </section>

              {/* Legal Basis */}
              <section className="bg-[#111111] rounded-lg p-4">
                <h3 className="text-lg font-semibold text-white mb-3">
                  4. Method and Legal Basis of Data Collection
                </h3>
                <p className="text-sm mb-2">
                  Personal data is collected based on the following legal grounds:
                </p>
                <ul className="text-sm space-y-1 ml-4">
                  <li>• <strong>Contract:</strong> Necessity for the establishment and performance of the platform service agreement.</li>
                  <li>• <strong>Legitimate Interest:</strong> Ensuring platform security, improving service quality, and carrying out operational processes.</li>
                  <li>• <strong>Explicit Consent:</strong> In certain cases such as marketing and communication activities, with your explicit consent.</li>
                  <li>• <strong>Legal Obligation:</strong> To fulfill our obligations arising from legal regulations.</li>
                </ul>
              </section>

              {/* User Rights */}
              <section className="bg-[#111111] rounded-lg p-4">
                <h3 className="text-lg font-semibold text-white mb-3">
                  5. Your Rights Under Data Protection Laws
                </h3>
                <p className="text-sm mb-2">
                  You have the following rights under applicable data protection laws:
                </p>
                <ul className="text-sm space-y-1 ml-4">
                  <li>• Learn whether your personal data is processed.</li>
                  <li>• If processed, request information regarding this processing.</li>
                  <li>• Learn the purpose of processing and whether the data is used in accordance with that purpose.</li>
                  <li>• Know the third parties to whom your personal data is transferred domestically or abroad.</li>
                  <li>• Request correction if your personal data is processed incompletely or inaccurately.</li>
                  <li>• Request deletion or destruction of personal data under the conditions set forth by law.</li>
                  <li>• Request notification of the above actions to third parties to whom data has been transferred.</li>
                  <li>• Object to decisions made exclusively based on automated processing that significantly affects you.</li>
                  <li>• Request compensation for damages arising from unlawful processing of your personal data.</li>
                </ul>
              </section>

              {/* Data Retention */}
              <section className="bg-[#111111] rounded-lg p-4">
                <h3 className="text-lg font-semibold text-white mb-3">
                  6. Data Retention Period
                </h3>
                <p className="text-sm mb-2">
                  We retain your personal data for the following periods:
                </p>
                <ul className="text-sm space-y-1 ml-4">
                  <li>• <strong>Account Data:</strong> Until you delete your account or request deletion</li>
                  <li>• <strong>Chat Messages:</strong> Until you delete your account or the chat is deleted</li>
                  <li>• <strong>Profile Information:</strong> Until you update or delete your profile</li>
                  <li>• <strong>Analytics Data:</strong> Up to 2 years in anonymized form</li>
                  <li>• <strong>Log Data:</strong> Up to 1 year for security and debugging purposes</li>
                </ul>
              </section>

              {/* Security Measures */}
              <section className="bg-[#111111] rounded-lg p-4">
                <h3 className="text-lg font-semibold text-white mb-3">
                  7. Security Measures
                </h3>
                <p className="text-sm mb-2">
                  We implement the following security measures to protect your data:
                </p>
                <ul className="text-sm space-y-1 ml-4">
                  <li>• <strong>Encryption:</strong> All data is encrypted in transit and at rest</li>
                  <li>• <strong>Authentication:</strong> Secure authentication using Firebase Auth</li>
                  <li>• <strong>Access Control:</strong> Strict access controls and role-based permissions</li>
                  <li>• <strong>Regular Audits:</strong> Regular security audits and vulnerability assessments</li>
                  <li>• <strong>Data Backup:</strong> Regular backups with encryption</li>
                  <li>• <strong>Incident Response:</strong> Procedures for handling security incidents</li>
                </ul>
              </section>

              {/* Contact */}
              <section className="bg-[#111111] rounded-lg p-4">
                <h3 className="text-lg font-semibold text-white mb-3">
                  8. Exercising Your Rights
                </h3>
                <p className="text-sm">
                  To exercise the rights mentioned above, you can email us at <strong className="text-white">support@coparty.club</strong> or contact us through the platform. Your request will be answered within 30 days at the latest.
                </p>
              </section>

              {/* Legal Compliance */}
              <section className="bg-[#111111] rounded-lg p-4">
                <h3 className="text-lg font-semibold text-white mb-3">
                  9. Legal Compliance
                </h3>
                <p className="text-sm mb-2">
                  This Privacy Policy complies with:
                </p>
                <ul className="text-sm space-y-1 ml-4">
                  <li>• <strong>GDPR (EU):</strong> General Data Protection Regulation</li>
                  <li>• <strong>KVKK (Turkey):</strong> Personal Data Protection Law</li>
                  <li>• <strong>CCPA (California):</strong> California Consumer Privacy Act</li>
                  <li>• <strong>Other applicable data protection laws</strong></li>
                </ul>
                <p className="text-sm mt-2">
                  We regularly review and update this policy to ensure compliance with changing regulations.
                </p>
              </section>

              {/* Last Update */}
              <section className="pt-4 border-t border-[#333333]">
                <p className="text-xs text-[#666666]">
                  <strong>Last Updated:</strong> {new Date().toLocaleDateString('en-US', { day: '2-digit', month: 'long', year: 'numeric' })}
                </p>
              </section>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 p-6 border-t border-[#333333] bg-[#111111]">
            {onDecline && (
              <button
                onClick={() => {
                  onDecline();
                  onClose();
                }}
                className="px-6 py-2 border border-[#333333] hover:bg-[#1a1a1a] text-white rounded-lg transition-colors font-medium"
              >
                Decline
              </button>
            )}
            <button
              onClick={() => {
                if (onAccept) {
                  onAccept();
                }
                onClose();
              }}
              className="px-6 py-2 bg-[#316afd] hover:bg-[#3a76ff] text-white rounded-lg transition-colors font-medium"
            >
              {onAccept ? 'Accept' : 'I Understand'}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}