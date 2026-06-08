<template>
  <div class="landing-container">
    <header class="landing-header">
      <h1>Calendar Templates</h1>
    </header>

    <main class="grid-container">
      
      <section class="grid-row">
        <div class="text-block left-aligned">
          <p>Time blocking is great for organizing the routine, but Google Calendar doesn’t fully support my needs.</p>
        </div>
        <div class="image-block">
          <img
            src="/gcal.png"
            alt="time block with google calendar"
            class="responsive-illustration"
            loading="lazy">
        </div>
      </section>

      <section class="grid-row reverse-row">
        <div class="image-block">
          <img
            src="/tblock.png"
            alt="time block with google calendar"
            class="responsive-illustration"
            loading="lazy">
        </div>
        <div class="text-block right-aligned">
          <p>If I register just the appointments, then I must be aware to avoid conflict. Or, if I put some buffers to the events, then either I forget the original time or it’s a lot of manual effort.</p>
        </div>
      </section>

      <section class="grid-row">
        <div class="text-block left-aligned">
          <p>And that’s the reason I created Calendar Templates: now, I can configure once a given structure of event and buffers, and apply it whenever I need.</p>
        </div>
        <div class="image-block">
          <img
            src="/template.png"
            alt="time block with google calendar"
            class="responsive-illustration"
            loading="lazy">
        </div>
      </section>

      <section class="grid-row reverse-row">
        <div class="image-block">
          <img
            src="/tempzoom.png"
            alt="time block with google calendar"
            class="responsive-illustration"
            loading="lazy">
        </div>
        <div class="text-block right-aligned">
          <p>For example, when I go to the gym, I know it takes me 15 minutes to get there and change, then my class lasts 50 minutes, I take a quick 5-minutes shower and afterwards another 15 minutes back home.</p>
        </div>
      </section>

      <section class="grid-row">
        <div class="text-block left-aligned">
          <p>If I decide to go tomorrow morning, I just apply the template for the 7:10 class, and Calendar Templates automatically calculates the buffers.</p>
        </div>
        <div class="text-block right-aligned">
          <p>Same template for when I decide to go in my lunch break, it automatically creates the events for me if I set to the 12:30 class.</p>
        </div>
      </section>

    </main>
  </div>
</template>

<style scoped>
.landing-container {
  background-color: #1e1e1e;
  color: #e0e0e0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  min-height: 100vh;
  padding: 2rem 1rem;
  box-sizing: border-box;
}

.landing-header {
  text-align: center;
  margin-bottom: 4rem;
}

.landing-header h1 {
  font-size: 2.5rem;
  font-weight: 400;
  letter-spacing: 0.5px;
}

.grid-container {
  max-width: 1100px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 5rem;
}

.grid-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  gap: 4rem;
}

.text-block {
  font-size: 1.15rem;
  line-height: 1.6;
}

.left-aligned {
  text-align: left;
  padding-right: 2rem;
}

.right-aligned {
  text-align: left;
  padding-left: 2rem;
}

.image-block {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.responsive-illustration {
  width: 100%;
  max-width: 480px;
  height: 280px;
  object-fit: cover;
  object-position: center center;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

@media (max-width: 768px) {
  .grid-row {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .grid-container {
    gap: 3.5rem;
  }

  .left-aligned, .right-aligned {
    padding: 0;
    text-align: center;
  }
}
</style>