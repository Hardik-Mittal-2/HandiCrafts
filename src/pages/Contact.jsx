import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';

export const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      
      setTimeout(() => {
        setIsSubmitted(false);
      }, 5000);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email',
      value: 'support@haandicrafts.com',
      link: 'mailto:support@haandicrafts.com',
    },
    {
      icon: Phone,
      title: 'Phone',
      value: '+91 98765 43210',
      link: 'tel:+919876543210',
    },
    {
      icon: MapPin,
      title: 'Address',
      value: 'Mumbai, Maharashtra, India',
      link: null,
    },
  ];

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="mb-4">Get in Touch</h1>
          <p className="text-lg text-deep-terracotta/70 dark:text-warm-ivory/70">
            We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div className="space-y-6">
            {contactInfo.map((info, index) => {
              const Icon = info.icon;
              return (
                <div
                  key={index}
                  className="bg-white dark:bg-dark-surface rounded-xl p-6 shadow-lg"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-bronze-gold to-goldenrod rounded-full flex items-center justify-center flex-shrink-0">
                      <Icon size={24} className="text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg mb-2">{info.title}</h3>
                      {info.link ? (
                        <a
                          href={info.link}
                          className="text-bronze-gold hover:text-goldenrod transition-colors"
                        >
                          {info.value}
                        </a>
                      ) : (
                        <p className="text-deep-terracotta/60 dark:text-warm-ivory/60">
                          {info.value}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Business Hours */}
            <div className="bg-gradient-to-br from-bronze-gold to-goldenrod rounded-xl p-6 shadow-lg text-white">
              <h3 className="text-lg mb-4">Business Hours</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Monday - Friday</span>
                  <span>9:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Saturday</span>
                  <span>10:00 AM - 4:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Sunday</span>
                  <span>Closed</span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-dark-surface rounded-xl p-8 shadow-lg">
              {isSubmitted ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle size={40} className="text-green-600" />
                  </div>
                  <h3 className="text-2xl mb-4">Message Sent Successfully!</h3>
                  <p className="text-deep-terracotta/60 dark:text-warm-ivory/60">
                    Thank you for contacting us. We'll get back to you soon.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm mb-2">
                        Your Name *
                      </label>
                      <input
                        id="name"
                        type="text"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="w-full px-4 py-3 border-2 border-bronze-gold/30 rounded-lg focus:outline-none focus:border-bronze-gold bg-white dark:bg-dark-surface transition-colors"
                        placeholder="Enter your name"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm mb-2">
                        Email Address *
                      </label>
                      <input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className="w-full px-4 py-3 border-2 border-bronze-gold/30 rounded-lg focus:outline-none focus:border-bronze-gold bg-white dark:bg-dark-surface transition-colors"
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm mb-2">
                      Subject *
                    </label>
                    <input
                      id="subject"
                      type="text"
                      value={formData.subject}
                      onChange={(e) =>
                        setFormData({ ...formData, subject: e.target.value })
                      }
                      className="w-full px-4 py-3 border-2 border-bronze-gold/30 rounded-lg focus:outline-none focus:border-bronze-gold bg-white dark:bg-dark-surface transition-colors"
                      placeholder="What is this about?"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm mb-2">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      rows={6}
                      className="w-full px-4 py-3 border-2 border-bronze-gold/30 rounded-lg focus:outline-none focus:border-bronze-gold bg-white dark:bg-dark-surface transition-colors resize-none"
                      placeholder="Type your message here..."
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 bg-bronze-gold hover:bg-goldenrod text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      'Sending...'
                    ) : (
                      <>
                        <Send size={20} />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <h2 className="mb-4">Frequently Asked Questions</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                q: 'How can I become an artisan on HaandiCrafts?',
                a: 'Sign up with an Artisan account, complete your profile, and start listing your handcrafted products. Our team will review and approve your listings.',
              },
              {
                q: 'What payment methods do you accept?',
                a: 'We accept all major credit cards, debit cards, UPI, net banking, and digital wallets for secure transactions.',
              },
              {
                q: 'How long does shipping take?',
                a: 'Shipping typically takes 5-7 business days within India. International shipping may take 10-15 business days depending on the destination.',
              },
              {
                q: 'What is your return policy?',
                a: 'We offer a 7-day return policy for damaged or defective items. Please contact us immediately if you have any issues with your order.',
              },
            ].map((faq, index) => (
              <div
                key={index}
                className="bg-white dark:bg-dark-surface rounded-xl p-6 shadow-lg"
              >
                <h3 className="text-lg mb-3 text-bronze-gold">{faq.q}</h3>
                <p className="text-deep-terracotta/60 dark:text-warm-ivory/60">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
