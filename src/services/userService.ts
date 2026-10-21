import { UserProfile } from '../types';
import { INITIAL_USERS } from './mockData';

const USERS_KEY = 'aura_estates_users_v1';

export function getUsers(): UserProfile[] {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    if (!raw) {
      localStorage.setItem(USERS_KEY, JSON.stringify(INITIAL_USERS));
      return INITIAL_USERS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_USERS;
  }
}

function saveUsers(users: UserProfile[]): void {
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  } catch (err) {
    console.error('Failed to save users:', err);
  }
}

export async function updateUserRole(userId: string, newRole: 'user' | 'admin'): Promise<UserProfile> {
  const users = getUsers();
  const idx = users.findIndex(u => u.id === userId);
  if (idx === -1) throw new Error('User not found');

  users[idx].role = newRole;
  users[idx].updated_at = new Date().toISOString();
  saveUsers(users);
  return users[idx];
}

export async function createUser(profile: Partial<UserProfile>): Promise<UserProfile> {
  const users = getUsers();
  const email = (profile.email || '').trim().toLowerCase();
  if (!email) throw new Error('Please enter a valid email address');
  if (users.some(u => u.email.toLowerCase() === email)) {
    throw new Error('An account with this email already exists.');
  }

  const newUser: UserProfile = {
    id: `usr-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    email,
    full_name: profile.full_name || 'Client Account',
    phone: profile.phone || '',
    role: profile.role || 'user',
    created_at: new Date().toISOString(),
    inquiry_count: 0,
  };
  users.push(newUser);
  saveUsers(users);
  return newUser;
}

export async function createDemoUser(profile: Partial<UserProfile>): Promise<UserProfile> {
  return createUser(profile);
}

export async function deleteUser(userId: string): Promise<boolean> {
  const users = getUsers();
  const filtered = users.filter(u => u.id !== userId);
  if (filtered.length === users.length) throw new Error('User not found');
  saveUsers(filtered);
  return true;
}

export async function resetDefaultUsers(): Promise<UserProfile[]> {
  saveUsers(INITIAL_USERS);
  return INITIAL_USERS;
}


