import test from 'node:test';
import assert from 'node:assert/strict';
import {
  isValidEmail,
  isValidPhone,
  sanitizeText,
  generateSafeSlug,
  escapeFilterValue,
  isDesignatedAdminEmail,
  resolveUserRole,
} from './security';

test('isValidPhone correctly validates international format', () => {
  assert.equal(isValidPhone('+1 (310) 555-0190'), true);
  assert.equal(isValidPhone('+44 20 7946 0991'), true);
  assert.equal(isValidPhone('3105550190'), true);
  assert.equal(isValidPhone('123'), false); // too short
  assert.equal(isValidPhone('invalid-letters'), false);
});

test('isValidEmail handles valid and invalid emails', () => {
  assert.equal(isValidEmail('concierge@auraestates.luxury'), true);
  assert.equal(isValidEmail('user.name+tag@domain.co.uk'), true);
  assert.equal(isValidEmail('bademail'), false);
  assert.equal(isValidEmail('missing@domain'), false);
});

test('sanitizeText does NOT strip HTML/angle brackets but removes control characters', () => {
  const input = '<Villa Bellissima>\x00\x08 Luxury Suite';
  const output = sanitizeText(input);
  assert.equal(output, '<Villa Bellissima> Luxury Suite');
});

test('generateSafeSlug produces clean URL slugs with accent removal', () => {
  assert.equal(generateSafeSlug('Résidence de l’Étoile — Penthouse'), 'residence-de-letoile-penthouse');
  assert.equal(generateSafeSlug('450 North Rodeo Drive #101'), '450-north-rodeo-drive-101');
});

test('escapeFilterValue escapes commas and quotes', () => {
  assert.equal(escapeFilterValue('Miami, FL'), 'Miami\\, FL');
  assert.equal(escapeFilterValue('Villa "Palazzo"'), 'Villa \\"Palazzo\\"');
});

test('isDesignatedAdminEmail correctly identifies bearbates512@gmail.com and standard admins', () => {
  assert.equal(isDesignatedAdminEmail('bearbates512@gmail.com'), true);
  assert.equal(isDesignatedAdminEmail('BEARBATES512@GMAIL.COM'), true);
  assert.equal(isDesignatedAdminEmail('  bearbates512@gmail.com  '), true);
  assert.equal(isDesignatedAdminEmail('admin@auraestates.luxury'), true);
  assert.equal(isDesignatedAdminEmail('client@example.com'), false);
  assert.equal(isDesignatedAdminEmail(''), false);
  assert.equal(isDesignatedAdminEmail(null), false);
});

test('resolveUserRole grants admin to designated emails and blocks unauthorized accounts', () => {
  // Designated admin email is always granted admin role
  assert.equal(resolveUserRole('bearbates512@gmail.com', null, null), 'admin');
  assert.equal(resolveUserRole('BEARBATES512@GMAIL.COM', 'user', null), 'admin');
  
  // Normal client accounts without admin role get user role
  assert.equal(resolveUserRole('client@example.com', null, null), 'user');
  assert.equal(resolveUserRole('client@example.com', 'user', null), 'user');
  
  // Custom accounts with explicit database or metadata admin get admin
  assert.equal(resolveUserRole('custom@example.com', 'admin', null), 'admin');
  assert.equal(resolveUserRole('custom@example.com', null, 'admin'), 'admin');
});
