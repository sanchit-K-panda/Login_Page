/**
 * Cybersecurity Event — Authentication Module
 */

/**
 * Authenticate a team registration.
 * @param {string} teamId — The team identifier string.
 * @param {Array<{nickname: string, serial: string}>} operatives — Array of operative data.
 * @returns {{ success: boolean, message: string }}
 */
export function authenticate(teamId, operatives) {
  // Team identifier must not be empty
  if (!teamId || teamId.trim().length === 0) {
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
