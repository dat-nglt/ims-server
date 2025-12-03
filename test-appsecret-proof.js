// test-appsecret-proof.js
// Script để test tính toán appsecret_proof cho Zalo API

import crypto from 'crypto';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const ZALO_SECRET_KEY = process.env.ZALO_SECRET_KEY;

/**
 * Tính toán appsecret_proof cho Zalo API
 * @param {string} accessToken - Access token từ Zalo
 * @param {string} appSecret - Zalo App Secret Key
 * @returns {string} appsecret_proof
 */
const calculateAppSecretProof = (accessToken, appSecret) => {
    const hmac = crypto.createHmac('sha256', appSecret);
    hmac.update(accessToken);
    return hmac.digest('hex');
};

// Test với sample data
const sampleAccessToken = 'sample_access_token_123';
const appSecretProof = calculateAppSecretProof(sampleAccessToken, ZALO_SECRET_KEY);

console.log('Sample Access Token:', sampleAccessToken);
console.log('App Secret Key:', ZALO_SECRET_KEY ? ZALO_SECRET_KEY.substring(0, 10) + '...' : 'NOT SET');
console.log('App Secret Proof:', appSecretProof);

// Verify calculation
const expectedProof = crypto.createHmac('sha256', ZALO_SECRET_KEY).update(sampleAccessToken).digest('hex');
console.log('Verification:', appSecretProof === expectedProof ? 'PASS' : 'FAIL');