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

test('isDesignatedAdminEmail strictly and exclusively identifies langcasen@gmail.com', () => {
  assert.equal(isDesignatedAdminEmail('langcasen@gmail.com'), true);
  assert.equal(isDesignatedAdminEmail('LANGCASEN@GMAIL.COM'), true);
  assert.equal(isDesignatedAdminEmail('  langcasen@gmail.com  '), true);
  // All other accounts are strictly non-admin
  assert.equal(isDesignatedAdminEmail('bearbates512@gmail.com'), false);
  assert.equal(isDesignatedAdminEmail('admin@auraestates.luxury'), false);
  assert.equal(isDesignatedAdminEmail('admin@auraestates.com'), false);
  assert.equal(isDesignatedAdminEmail('client@example.com'), false);
  assert.equal(isDesignatedAdminEmail(''), false);
  assert.equal(isDesignatedAdminEmail(null), false);
});

test('resolveUserRole grants admin exclusively to langcasen@gmail.com', () => {
  // Only langcasen@gmail.com can hold admin role
  assert.equal(resolveUserRole('langcasen@gmail.com', null, null), 'admin');
  assert.equal(resolveUserRole('LANGCASEN@GMAIL.COM', 'user', null), 'admin');
  
  // All other accounts are strictly user
  assert.equal(resolveUserRole('bearbates512@gmail.com', 'admin', null), 'user');
  assert.equal(resolveUserRole('admin@auraestates.luxury', 'admin', null), 'user');
  assert.equal(resolveUserRole('client@example.com', null, null), 'user');
  assert.equal(resolveUserRole('client@example.com', 'admin', null), 'user');
  assert.equal(resolveUserRole('other@example.com', null, 'admin'), 'user');
});
