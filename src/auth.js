/**
 * Cybersecurity Event — Authentication Module
 * Hardcoded credential validation for hackathon demo.
 */

const VALID_TEAM_ID = 'TEAM_ALPHA';

/**
 * Authenticate a team registration.
 * @param {string} teamId — The team identifier string.
 * @param {Array<{nickname: string, serial: string}>} operatives — Array of operative data.
 * @returns {{ success: boolean, message: string }}
 */
export function authenticate(teamId, operatives) {
  // Check team identifier (case-insensitive)
  if (teamId.trim().toUpperCase() !== VALID_TEAM_ID) {
    return {
      success: false,
      message: 'ACCESS DENIED',
    };
  }

  // At least one operative must have a nickname filled in
  const hasOperative = operatives.some(
    (op) => op.nickname && op.nickname.trim().length > 0
  );

  if (!hasOperative) {
    return {
      success: false,
      message: 'ACCESS DENIED',
    };
  }

  return {
    success: true,
    message: 'ACCESS GRANTED',
  };
}
