const SUPABASE_MODULE_URL = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";
const AVATARS = ["📚", "⭐", "🕊️", "🌿", "🦉", "🏛️"];
const AVATAR_COLORS = ["blue", "gold", "green", "burgundy", "violet"];

const guestbookForm = document.getElementById("guestbookForm");
const guestbookFirstName = document.getElementById("guestbookFirstName");
const guestbookLastName = document.getElementById("guestbookLastName");
const guestbookReview = document.getElementById("guestbookReview");
const guestbookConsent = document.getElementById("guestbookConsent");
const guestbookSubmit = document.getElementById("guestbookSubmit");
const guestbookAvatarOptions = document.getElementById("guestbookAvatarOptions");
const guestbookColorOptions = document.getElementById("guestbookColorOptions");
const guestbookAvatarPreview = document.getElementById("guestbookAvatarPreview");
const guestbookFeedback = document.getElementById("guestbookFeedback");
const guestbookLoadFeedback = document.getElementById("guestbookLoadFeedback");
const guestbookReviewList = document.getElementById("guestbookReviewList");
const guestbookModerator = document.getElementById("guestbookModerator");
const guestbookLogin = document.getElementById("guestbookLogin");
const moderatorEmail = document.getElementById("moderatorEmail");
const moderatorPassword = document.getElementById("moderatorPassword");
const moderatorLoginButton = document.getElementById("moderatorLoginButton");
const moderatorFeedback = document.getElementById("moderatorFeedback");
const guestbookAdmin = document.getElementById("guestbookAdmin");
const guestbookAdminList = document.getElementById("guestbookAdminList");
const moderatorAdminFeedback = document.getElementById("moderatorAdminFeedback");

let supabase;
let selectedEmoji = AVATARS[0];
let selectedColor = AVATAR_COLORS[0];

function setMessage(element, message, isError = false) {
  element.textContent = message;
  element.classList.toggle("is-error", isError);
}

function reportError(element, message, error) {
  console.error(message, error);
  setMessage(element, message, true);
}

function makeAvatar(emoji, color, label) {
  const avatar = document.createElement("span");
  avatar.className = `guestbook-avatar guestbook-avatar--${color}`;
  avatar.textContent = emoji;
  avatar.setAttribute("aria-label", label);
  return avatar;
}

function updateAvatarPreview() {
  guestbookAvatarPreview.replaceChildren(
    makeAvatar(selectedEmoji, selectedColor, "Выбранный аватар")
  );
}

function createAvatarChoices() {
  AVATARS.forEach((emoji) => {
    const option = document.createElement("button");
    option.type = "button";
    option.className = "guestbook-avatar-choice";
    option.textContent = emoji;
    option.setAttribute("aria-label", `Аватар ${emoji}`);
    option.setAttribute("aria-pressed", String(emoji === selectedEmoji));
    option.addEventListener("click", () => {
      selectedEmoji = emoji;
      guestbookAvatarOptions.querySelectorAll("button").forEach((button) => {
        button.setAttribute("aria-pressed", String(button === option));
      });
      updateAvatarPreview();
    });
    guestbookAvatarOptions.append(option);
  });

  AVATAR_COLORS.forEach((color) => {
    const option = document.createElement("button");
    option.type = "button";
    option.className = `guestbook-color-choice guestbook-avatar--${color}`;
    option.setAttribute("aria-label", `Цвет аватара: ${color}`);
    option.setAttribute("aria-pressed", String(color === selectedColor));
    option.addEventListener("click", () => {
      selectedColor = color;
      guestbookColorOptions.querySelectorAll("button").forEach((button) => {
        button.setAttribute("aria-pressed", String(button === option));
      });
      updateAvatarPreview();
    });
    guestbookColorOptions.append(option);
  });

  updateAvatarPreview();
}

function formatReviewDate(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? ""
    : date.toLocaleDateString("ru-RU", { year: "numeric", month: "long", day: "numeric" });
}

function createReviewCard(review, isModeration = false) {
  const card = document.createElement("article");
  card.className = `guestbook-review${isModeration ? " guestbook-review--moderation" : ""}`;

  const header = document.createElement("div");
  header.className = "guestbook-review-header";
  header.append(makeAvatar(review.avatar_emoji, review.avatar_color, "Аватар автора отзыва"));

  const identity = document.createElement("div");
  identity.className = "guestbook-review-identity";
  const name = document.createElement("h3");
  name.textContent = `${review.first_name} ${review.last_name}`;
  identity.append(name);

  const date = document.createElement("time");
  date.dateTime = review.created_at;
  date.textContent = formatReviewDate(review.created_at);
  identity.append(date);
  header.append(identity);

  if (isModeration) {
    const status = document.createElement("span");
    status.className = `guestbook-status guestbook-status--${review.status}`;
    status.textContent = {
      pending: "На проверке",
      approved: "Опубликован",
      rejected: "Отклонён",
    }[review.status];
    header.append(status);
  }

  const body = document.createElement("p");
  body.className = "guestbook-review-body";
  body.textContent = review.body;
  card.append(header, body);

  if (isModeration) {
    const actions = document.createElement("div");
    actions.className = "guestbook-review-actions";
    if (review.status !== "approved") {
      actions.append(createReviewAction(review.id, "approved", "Одобрить"));
    }
    if (review.status !== "rejected") {
      actions.append(createReviewAction(review.id, "rejected", "Отклонить"));
    }
    actions.append(createDeleteAction(review.id));
    card.append(actions);
  }

  return card;
}

function createReviewAction(id, status, label) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "guestbook-secondary-button";
  button.textContent = label;
  button.addEventListener("click", () => updateReviewStatus(id, status));
  return button;
}

function createDeleteAction(id) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "guestbook-secondary-button guestbook-secondary-button--danger";
  button.textContent = "Удалить";
  button.addEventListener("click", () => deleteReview(id));
  return button;
}

async function loadPublishedReviews() {
  setMessage(guestbookLoadFeedback, "Загружаем отзывы…");
  try {
    const { data, error } = await supabase
      .from("guestbook_reviews")
      .select("id, first_name, last_name, body, avatar_emoji, avatar_color, created_at")
      .eq("status", "approved")
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) {
      reportError(guestbookLoadFeedback, "Не удалось загрузить отзывы. Попробуйте позже.", error);
      return;
    }

    guestbookReviewList.replaceChildren();
    if (!data.length) {
      setMessage(guestbookLoadFeedback, "Пока нет опубликованных отзывов.");
      return;
    }

    data.forEach((review) => guestbookReviewList.append(createReviewCard(review)));
    setMessage(guestbookLoadFeedback, "");
  } catch (error) {
    reportError(guestbookLoadFeedback, "Не удалось загрузить отзывы. Проверьте подключение.", error);
  }
}

async function loadModerationReviews() {
  setMessage(moderatorAdminFeedback, "Загружаем отзывы…");
  try {
    const { data, error } = await supabase
      .from("guestbook_reviews")
      .select("id, first_name, last_name, body, avatar_emoji, avatar_color, status, created_at")
      .order("created_at", { ascending: false })
      .limit(100);

    if (error) {
      reportError(moderatorAdminFeedback, "Не удалось загрузить отзывы для модерации.", error);
      return;
    }

    guestbookAdminList.replaceChildren();
    if (!data.length) {
      setMessage(moderatorAdminFeedback, "Отзывов пока нет.");
      return;
    }

    data.forEach((review) => guestbookAdminList.append(createReviewCard(review, true)));
    setMessage(moderatorAdminFeedback, "");
  } catch (error) {
    reportError(moderatorAdminFeedback, "Не удалось загрузить отзывы для модерации.", error);
  }
}

async function updateReviewStatus(id, status) {
  setMessage(moderatorAdminFeedback, "Сохраняем решение…");
  try {
    const { error } = await supabase
      .from("guestbook_reviews")
      .update({ status })
      .eq("id", id);

    if (error) {
      reportError(moderatorAdminFeedback, "Не удалось изменить статус отзыва.", error);
      return;
    }

    await Promise.all([loadModerationReviews(), loadPublishedReviews()]);
  } catch (error) {
    reportError(moderatorAdminFeedback, "Не удалось изменить статус отзыва.", error);
  }
}

async function deleteReview(id) {
  if (!window.confirm("Удалить этот отзыв без возможности восстановления?")) return;
  setMessage(moderatorAdminFeedback, "Удаляем отзыв…");
  try {
    const { error } = await supabase
      .from("guestbook_reviews")
      .delete()
      .eq("id", id);

    if (error) {
      reportError(moderatorAdminFeedback, "Не удалось удалить отзыв.", error);
      return;
    }

    await Promise.all([loadModerationReviews(), loadPublishedReviews()]);
  } catch (error) {
    reportError(moderatorAdminFeedback, "Не удалось удалить отзыв.", error);
  }
}

async function verifyModerator(session) {
  if (!session) {
    guestbookAdmin.hidden = true;
    guestbookLogin.hidden = false;
    return;
  }

  try {
    const { data, error } = await supabase.rpc("is_guestbook_moderator");
    if (error) {
      reportError(moderatorFeedback, "Не удалось проверить права модератора.", error);
      return;
    }

    if (data !== true) {
      const { error: signOutError } = await supabase.auth.signOut();
      if (signOutError) {
        reportError(moderatorFeedback, "У аккаунта нет прав модератора, и не удалось завершить сеанс.", signOutError);
        return;
      }
      guestbookAdmin.hidden = true;
      guestbookLogin.hidden = false;
      setMessage(moderatorFeedback, "У этого аккаунта нет прав модератора.", true);
      return;
    }

    guestbookLogin.hidden = true;
    guestbookAdmin.hidden = false;
    guestbookModerator.open = true;
    setMessage(moderatorFeedback, "");
    await loadModerationReviews();
  } catch (error) {
    reportError(moderatorFeedback, "Не удалось проверить права модератора.", error);
  }
}

async function initializeGuestbook() {
  createAvatarChoices();

  const config = window.MUSEUM_GUESTBOOK_CONFIG;
  if (!config || !config.supabaseUrl || !config.publishableKey) {
    setMessage(guestbookLoadFeedback, "Книга отзывов пока не настроена.", true);
    guestbookSubmit.disabled = true;
    return;
  }

  const { createClient } = await import(SUPABASE_MODULE_URL);
  supabase = createClient(config.supabaseUrl, config.publishableKey);
  await loadPublishedReviews();

  guestbookForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!guestbookForm.reportValidity()) return;

    guestbookSubmit.disabled = true;
    setMessage(guestbookFeedback, "Отправляем отзыв на проверку…");
    try {
      const { error } = await supabase.from("guestbook_reviews").insert({
        first_name: guestbookFirstName.value.trim(),
        last_name: guestbookLastName.value.trim(),
        body: guestbookReview.value.trim(),
        avatar_emoji: selectedEmoji,
        avatar_color: selectedColor,
        consent: guestbookConsent.checked,
      });

      if (error) {
        reportError(guestbookFeedback, "Не удалось отправить отзыв. Попробуйте позже.", error);
        return;
      }

      guestbookForm.reset();
      selectedEmoji = AVATARS[0];
      selectedColor = AVATAR_COLORS[0];
      guestbookAvatarOptions.querySelectorAll("button").forEach((button) => {
        button.setAttribute("aria-pressed", String(button.textContent === selectedEmoji));
      });
      guestbookColorOptions.querySelectorAll("button").forEach((button) => {
        button.setAttribute("aria-pressed", String(button.classList.contains(`guestbook-avatar--${selectedColor}`)));
      });
      updateAvatarPreview();
      setMessage(guestbookFeedback, "Спасибо! Отзыв отправлен и появится после одобрения модератором.");
    } catch (error) {
      reportError(guestbookFeedback, "Не удалось отправить отзыв. Проверьте подключение.", error);
    } finally {
      guestbookSubmit.disabled = false;
    }
  });

  guestbookLogin.addEventListener("submit", async (event) => {
    event.preventDefault();
    moderatorLoginButton.disabled = true;
    setMessage(moderatorFeedback, "Входим…");
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: moderatorEmail.value.trim(),
        password: moderatorPassword.value,
      });

      if (error) {
        reportError(moderatorFeedback, "Не удалось войти. Проверьте email и пароль.", error);
        return;
      }

      moderatorPassword.value = "";
      await verifyModerator(data.session);
    } catch (error) {
      reportError(moderatorFeedback, "Не удалось войти. Проверьте подключение.", error);
    } finally {
      moderatorLoginButton.disabled = false;
    }
  });

  document.getElementById("moderatorSignOut").addEventListener("click", async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        reportError(moderatorAdminFeedback, "Не удалось завершить сеанс модератора.", error);
        return;
      }
      guestbookAdmin.hidden = true;
      guestbookLogin.hidden = false;
      setMessage(moderatorFeedback, "Вы вышли из панели модерации.");
    } catch (error) {
      reportError(moderatorAdminFeedback, "Не удалось завершить сеанс модератора.", error);
    }
  });

  supabase.auth.onAuthStateChange((event, session) => {
    if (event === "SIGNED_OUT") {
      guestbookAdmin.hidden = true;
      guestbookLogin.hidden = false;
    } else if (event === "INITIAL_SESSION" && session) {
      window.setTimeout(() => verifyModerator(session), 0);
    }
  });
}

initializeGuestbook().catch((error) => {
  reportError(guestbookLoadFeedback, "Не удалось подключить книгу отзывов.", error);
  guestbookSubmit.disabled = true;
});
