<template>
  <div class="layout">
    <header class="navbar">
      <div class="container nav-content">
        <div class="brand">Vue 模板</div>
      </div>
    </header>
    <main class="container main-content">
      <RouterView />
    </main>
  </div>
</template>

<style scoped lang="scss">
.navbar {
  background: var(--bg-card);
  box-shadow: var(--shadow-sm);
  position: sticky;
  top: 0;
  z-index: 10;
}

.container {
  max-width: 960px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.nav-content {
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.brand {
  font-weight: 700;
  font-size: 1.25rem;
  color: var(--primary-color);
}

.nav-links {
  display: flex;
  gap: 1.5rem;

  a {
    text-decoration: none;
    color: var(--text-secondary);
    font-weight: 500;
    transition: color 0.2s;

    &:hover,
    &.active {
      color: var(--primary-color);
    }
  }
}

.main-content {
  padding-top: 2rem;
  padding-bottom: 3rem;
}
</style>
