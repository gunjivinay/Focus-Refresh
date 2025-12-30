export interface ShareData {
  title: string;
  text: string;
  url?: string;
}

export async function shareBadge(badgeName: string, badgeEmoji: string): Promise<boolean> {
  const shareData: ShareData = {
    title: 'I earned a badge!',
    text: `I just earned the ${badgeEmoji} ${badgeName} badge on Focus Refresh! 🎉`,
    url: window.location.origin,
  };

  if (navigator.share) {
    try {
      await navigator.share(shareData);
      return true;
    } catch (error) {
      // User cancelled or error occurred
      if ((error as Error).name !== 'AbortError') {
        console.error('Error sharing:', error);
      }
      return false;
    }
  } else {
    // Fallback: copy to clipboard
    const text = `${shareData.text}\n${shareData.url || ''}`;
    try {
      await navigator.clipboard.writeText(text);
      alert('Badge info copied to clipboard!');
      return true;
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      return false;
    }
  }
}

export async function shareProfile(
  userName: string,
  totalGames: number,
  badgesEarned: number,
  totalBadges: number
): Promise<boolean> {
  const shareData: ShareData = {
    title: 'My Focus Refresh Profile',
    text: `Check out my Focus Refresh stats! 🎮\n\n${userName}\nGames Played: ${totalGames}\nBadges: ${badgesEarned}/${totalBadges}`,
    url: window.location.origin,
  };

  if (navigator.share) {
    try {
      await navigator.share(shareData);
      return true;
    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
        console.error('Error sharing:', error);
      }
      return false;
    }
  } else {
    const text = `${shareData.text}\n${shareData.url || ''}`;
    try {
      await navigator.clipboard.writeText(text);
      alert('Profile info copied to clipboard!');
      return true;
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      return false;
    }
  }
}

