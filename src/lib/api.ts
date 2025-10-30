const API_URL = 'https://functions.poehali.dev/b255f161-6db3-41bf-9d98-c46c9607a363';

export const api = {
  async getDashboard() {
    const response = await fetch(`${API_URL}?action=dashboard`);
    return response.json();
  },

  async getWeightHistory() {
    const response = await fetch(`${API_URL}?action=weight_history`);
    return response.json();
  },

  async getMeals(date?: string) {
    const url = date ? `${API_URL}?action=meals&date=${date}` : `${API_URL}?action=meals`;
    const response = await fetch(url);
    return response.json();
  },

  async getWorkouts(days = 7) {
    const response = await fetch(`${API_URL}?action=workouts&days=${days}`);
    return response.json();
  },

  async getPosts() {
    const response = await fetch(`${API_URL}?action=posts`);
    return response.json();
  },

  async getChallenges() {
    const response = await fetch(`${API_URL}?action=challenges`);
    return response.json();
  },

  async getRecipes() {
    const response = await fetch(`${API_URL}?action=recipes`);
    return response.json();
  },

  async getExercises() {
    const response = await fetch(`${API_URL}?action=exercises`);
    return response.json();
  },

  async likePost(postId: number) {
    const response = await fetch(`${API_URL}?action=like`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ post_id: postId })
    });
    return response.json();
  }
};
