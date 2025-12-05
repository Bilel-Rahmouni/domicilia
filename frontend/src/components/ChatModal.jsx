'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useChat } from '../context/ChatContext';
import styles from './ChatModal.module.css';

/**
 * Modal de chat simplifié
 * Design professionnel et épuré
 */
export default function ChatModal({ isOpen, onClose, companyId: propCompanyId }) {
  const {
    isLoading,
    error,
    companyId: contextCompanyId,
    setCompanyId,
    sendMessage,
    lastSentMessage,
  } = useChat();

  const [messageInput, setMessageInput] = useState('');
  const [userInfo, setUserInfo] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const inputRef = useRef(null);

  const activeCompanyId = propCompanyId || contextCompanyId;

  // Mettre à jour le companyId si fourni en prop
  useEffect(() => {
    if (propCompanyId && propCompanyId !== contextCompanyId) {
      setCompanyId(propCompanyId);
    }
  }, [propCompanyId, contextCompanyId, setCompanyId]);

  // Focus sur l'input quand le modal s'ouvre
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Afficher le message de succès
  useEffect(() => {
    if (lastSentMessage?.success) {
      setShowSuccess(true);
      setMessageInput('');
      setTimeout(() => {
        setShowSuccess(false);
        onClose();
      }, 2000);
    }
  }, [lastSentMessage, onClose]);

  // Fermer avec Escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!messageInput.trim()) return;
    if (!userInfo.name || !userInfo.email) {
      alert('Veuillez remplir votre nom et email');
      return;
    }

    try {
      await sendMessage(messageInput, userInfo);
    } catch (err) {
      console.error('Erreur lors de l\'envoi:', err);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.backdrop} onClick={handleBackdropClick}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2>Contactez-nous</h2>
          <button className={styles.closeButton} onClick={onClose} aria-label="Fermer">
            ×
          </button>
        </div>

        <div className={styles.content}>
          {showSuccess ? (
            <div className={styles.successMessage}>
              <div className={styles.successIcon}>✓</div>
              <p>Message envoyé avec succès !</p>
            </div>
          ) : (
            <form className={styles.form} onSubmit={handleSubmit}>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="name">Nom *</label>
                  <input
                    id="name"
                    type="text"
                    value={userInfo.name}
                    onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
                    required
                    placeholder="Votre nom"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="email">Email *</label>
                  <input
                    id="email"
                    type="email"
                    value={userInfo.email}
                    onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
                    required
                    placeholder="votre@email.com"
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="phone">Téléphone</label>
                <input
                  id="phone"
                  type="tel"
                  value={userInfo.phone}
                  onChange={(e) => setUserInfo({ ...userInfo, phone: e.target.value })}
                  placeholder="+33 6 12 34 56 78"
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="message">Message *</label>
                <textarea
                  id="message"
                  ref={inputRef}
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  required
                  placeholder="Votre message..."
                  rows="4"
                />
              </div>

              {error && <div className={styles.errorMessage}>{error}</div>}

              <button type="submit" className={styles.submitButton} disabled={isLoading}>
                {isLoading ? 'Envoi...' : 'Envoyer'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
