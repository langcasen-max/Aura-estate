import test from 'node:test';
import assert from 'node:assert/strict';
import { isValidEmail, isValidPhone, sanitizeText, generateSafeSlug, escapeFilterValue } from './security';

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
