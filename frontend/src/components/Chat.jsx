'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useChat } from '../context/ChatContext';
import { useSearchParams } from 'next/navigation';
import styles from './Chat.module.css';

/**
 * Page de chat simplifiée
 * Design professionnel et épuré
 */
export default function Chat() {
  const searchParams = useSearchParams();
  const urlCompanyId = searchParams.get('companyId');

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

  const activeCompanyId = urlCompanyId || contextCompanyId;

  // Mettre à jour le companyId depuis l'URL
  useEffect(() => {
    if (urlCompanyId && urlCompanyId !== contextCompanyId) {
      setCompanyId(urlCompanyId);
    }
  }, [urlCompanyId, contextCompanyId, setCompanyId]);

  // Focus sur l'input
  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 100);
  }, []);

  // Afficher le message de succès
  useEffect(() => {
    if (lastSentMessage?.success) {
      setShowSuccess(true);
      setMessageInput('');
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    }
  }, [lastSentMessage]);

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

  return (
    <div className={styles.chatPage}>
      <div className={styles.chatContainer}>
        <div className={styles.header}>
          <h1>Contactez-nous</h1>
          {activeCompanyId && (
            <span className={styles.companyBadge}>{activeCompanyId}</span>
          )}
        </div>

        <div className={styles.content}>
          {showSuccess ? (
            <div className={styles.successMessage}>
              <div className={styles.successIcon}>✓</div>
              <p>Message envoyé avec succès !</p>
              <p className={styles.successSubtext}>Nous vous répondrons dans les plus brefs délais.</p>
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
                  rows="6"
                />
              </div>

              {error && <div className={styles.errorMessage}>{error}</div>}

              <button type="submit" className={styles.submitButton} disabled={isLoading}>
                {isLoading ? 'Envoi...' : 'Envoyer le message'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
