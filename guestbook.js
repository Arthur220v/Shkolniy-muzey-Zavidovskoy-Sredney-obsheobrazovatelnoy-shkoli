const SUPABASE_MODULE_URL = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";
const AVATAR_BUCKET = "guestbook-avatars";
const MAX_AVATAR_SIZE = 3 * 1024 * 1024;
const AVATAR_EXTENSIONS = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
]);
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
const guestbookAvatarFile = document.getElementById("guestbookAvatarFile");
const guestbookUseEmoji = document.getElementById("guestbookUseEmoji");
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
const guestbookHistory = document.getElementById("guestbookAdminHistory");
const guestbookHistoryList = document.getElementById("guestbookHistoryList");
const guestbookHistoryFeedback = document.getElementById("guestbookHistoryFeedback");
const guestbookAdminMenu = document.getElementById("guestbookAdminMenu");
const moderatorMenuToggle = document.getElementById("moderatorMenuToggle");
const guestbookAdminReviews = document.getElementById("guestbookAdminReviews");

let supabase;
let selectedEmoji = AVATARS[0];
let selectedColor = AVATAR_COLORS[0];
let selectedAvatarFile = null;
let selectedAvatarPreviewUrl = null;

function setMessage(element, message, isError = false) {
  element.textContent = message;
  element.classList.toggle("is-error", isError);
}

function reportError(element, message, error) {
  console.error(message, error);
  setMessage(element, message, true);
}

function getModeratorSignInErrorMessage(error) {
  if (error.code === "email_not_confirmed") {
    return "Email не подтверждён. Подтвердите адрес в Supabase → Authentication → Users и войдите снова.";
  }
  if (error.code === "invalid_credentials") {
    return "Supabase не принял email и пароль. Проверьте, что пользователь создан в Authentication → Users именно этого проекта; если нужно, отправьте ему письмо для сброса пароля.";
  }
  if (error.code === "email_provider_disabled") {
    return "В Supabase отключён вход по email и паролю. Включите провайдер Email в Authentication → Sign In / Providers.";
  }
  if (error.code === "over_request_rate_limit") {
    return "Слишком много попыток входа. Подождите и попробуйте ещё раз.";
  }
  return `Supabase отклонил вход (код: ${error.code || "не указан"}). Проверьте аккаунт в Authentication → Users.`;
}

function makeAvatar(emoji, color, label, photoUrl = null) {
  const avatar = document.createElement("span");
  avatar.className = `guestbook-avatar guestbook-avatar--${color}${photoUrl ? " guestbook-avatar--photo" : ""}`;
  avatar.setAttribute("aria-label", label);
  if (photoUrl) {
    const image = document.createElement("img");
    image.src = photoUrl;
    image.alt = "";
    image.loading = "lazy";
    image.addEventListener("error", () => {
      image.remove();
      avatar.textContent = emoji;
    }, { once: true });
    avatar.append(image);
  } else {
    avatar.textContent = emoji;
  }
  return avatar;
}

function updateAvatarPreview() {
  guestbookAvatarPreview.replaceChildren(
    makeAvatar(selectedEmoji, selectedColor, "Выбранный аватар", selectedAvatarPreviewUrl)
  );
}

function clearSelectedAvatarFile() {
  if (selectedAvatarPreviewUrl) URL.revokeObjectURL(selectedAvatarPreviewUrl);
  selectedAvatarFile = null;
  selectedAvatarPreviewUrl = null;
  guestbookAvatarFile.value = "";
  guestbookUseEmoji.hidden = true;
  updateAvatarPreview();
}

function handleAvatarFileSelection() {
  const file = guestbookAvatarFile.files[0];
  if (!file) return;

  if (!AVATAR_EXTENSIONS.has(file.type)) {
    clearSelectedAvatarFile();
    setMessage(guestbookFeedback, "Выберите изображение JPG, PNG или WebP.", true);
    return;
  }

  if (file.size > MAX_AVATAR_SIZE) {
    clearSelectedAvatarFile();
    setMessage(guestbookFeedback, "Размер фотографии не должен превышать 3 МБ.", true);
    return;
  }

  if (selectedAvatarPreviewUrl) URL.revokeObjectURL(selectedAvatarPreviewUrl);
  selectedAvatarFile = file;
  selectedAvatarPreviewUrl = URL.createObjectURL(file);
  guestbookUseEmoji.hidden = false;
  setMessage(guestbookFeedback, "Фото выбрано. Оно будет показано после одобрения модератором.");
  updateAvatarPreview();
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
      if (selectedAvatarFile) clearSelectedAvatarFile();
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
    option.title = color;
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

function formatHistoryDate(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? ""
    : date.toLocaleString("ru-RU", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
}

function createReviewCard(review, isModeration = false, photoUrl = null) {
  const card = document.createElement("article");
  card.className = `guestbook-review${isModeration ? " guestbook-review--moderation" : ""}`;

  const header = document.createElement("div");
  header.className = "guestbook-review-header";
  header.append(makeAvatar(review.avatar_emoji, review.avatar_color, "Аватар автора отзыва", photoUrl));

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
    if (review.avatar_image_path) {
      const avatarActions = document.createElement("div");
      avatarActions.className = "guestbook-avatar-moderation";
      const avatarStatus = document.createElement("span");
      avatarStatus.className = "guestbook-avatar-moderation-label";
      avatarStatus.textContent = `Фото аватара: ${
        {
          pending: "на проверке",
          approved: "одобрено",
          rejected: "отклонено",
        }[review.avatar_image_status]
      }`;
      avatarActions.append(avatarStatus);
      if (review.avatar_image_status !== "approved") {
        avatarActions.append(createAvatarStatusAction(review.id, "approved", "Одобрить фото"));
      }
      if (review.avatar_image_status !== "rejected") {
        avatarActions.append(createAvatarStatusAction(review.id, "rejected", "Отклонить фото"));
      }
      card.append(avatarActions);
    }

    const actions = document.createElement("div");
    actions.className = "guestbook-review-actions";
    if (review.status !== "approved") {
      actions.append(createReviewAction(review.id, "approved", "Одобрить"));
    }
    if (review.status !== "rejected") {
      actions.append(createReviewAction(review.id, "rejected", "Отклонить"));
    }
    actions.append(createDeleteAction(review.id, review.avatar_image_path));
    card.append(actions);
  }

  return card;
}

function createAvatarStatusAction(id, status, label) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "guestbook-secondary-button";
  button.textContent = label;
  button.addEventListener("click", () => updateAvatarStatus(id, status));
  return button;
}

function createReviewAction(id, status, label) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "guestbook-secondary-button";
  button.textContent = label;
  button.addEventListener("click", () => updateReviewStatus(id, status));
  return button;
}

function createDeleteAction(id, avatarPath) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "guestbook-secondary-button guestbook-secondary-button--danger";
  button.textContent = "Удалить";
  button.addEventListener("click", () => deleteReview(id, avatarPath));
  return button;
}

async function prepareReviewCards(reviews, isModeration, feedbackElement) {
  let photoFailures = 0;
  const cards = await Promise.all(reviews.map(async (review) => {
    let photoUrl = null;
    if (review.avatar_image_path && (isModeration || review.avatar_image_status === "approved")) {
      try {
        const { data, error } = await supabase.storage
          .from(AVATAR_BUCKET)
          .createSignedUrl(review.avatar_image_path, 300);
        if (error) {
          photoFailures += 1;
          console.error("Не удалось открыть фото аватара.", error);
        } else {
          photoUrl = data.signedUrl;
        }
      } catch (error) {
        photoFailures += 1;
        console.error("Не удалось открыть фото аватара.", error);
      }
    }
    return createReviewCard(review, isModeration, photoUrl);
  }));

  if (photoFailures) {
    setMessage(feedbackElement, "Отзывы загружены, но некоторые фотографии аватаров открыть не удалось.", true);
  }
  return cards;
}

async function loadPublishedReviews() {
  setMessage(guestbookLoadFeedback, "Загружаем отзывы…");
  try {
    const { data, error } = await supabase
      .from("guestbook_reviews")
      .select("id, first_name, last_name, body, avatar_emoji, avatar_color, avatar_image_path, avatar_image_status, created_at")
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

    const cards = await prepareReviewCards(data, false, guestbookLoadFeedback);
    guestbookReviewList.replaceChildren(...cards);
    if (!guestbookLoadFeedback.classList.contains("is-error")) {
      setMessage(guestbookLoadFeedback, "");
    }
  } catch (error) {
    reportError(guestbookLoadFeedback, "Не удалось загрузить отзывы. Проверьте подключение.", error);
  }
}

async function loadModerationReviews() {
  setMessage(moderatorAdminFeedback, "Загружаем отзывы…");
  try {
    const { data, error } = await supabase
      .from("guestbook_reviews")
      .select("id, first_name, last_name, body, avatar_emoji, avatar_color, avatar_image_path, avatar_image_status, status, created_at")
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

    const cards = await prepareReviewCards(data, true, moderatorAdminFeedback);
    guestbookAdminList.replaceChildren(...cards);
    if (!moderatorAdminFeedback.classList.contains("is-error")) {
      setMessage(moderatorAdminFeedback, "");
    }
  } catch (error) {
    reportError(moderatorAdminFeedback, "Не удалось загрузить отзывы для модерации.", error);
  }
}

async function loadModerationHistory() {
  setMessage(guestbookHistoryFeedback, "Загружаем историю…");
  try {
    const { data, error } = await supabase
      .from("guestbook_moderation_history")
      .select("id, reviewer_first_name, reviewer_last_name, review_body, action, previous_value, new_value, moderator_email, created_at")
      .order("created_at", { ascending: false })
      .limit(200);

    if (error) {
      reportError(guestbookHistoryFeedback, "Не удалось загрузить историю модерации.", error);
      return;
    }

    guestbookHistoryList.replaceChildren();
    if (!data.length) {
      setMessage(guestbookHistoryFeedback, "История пока пуста.");
      return;
    }

    const actionLabels = {
      review_submitted: "Отзыв отправлен на проверку",
      review_approved: "Отзыв одобрен",
      review_rejected: "Отзыв отклонён",
      review_reopened: "Статус отзыва изменён",
      review_deleted: "Отзыв удалён",
      avatar_approved: "Фото аватара одобрено",
      avatar_rejected: "Фото аватара отклонено",
      avatar_reset: "Статус фото аватара изменён",
      avatar_submitted: "Фото аватара отправлено на проверку",
    };

    data.forEach((event) => {
      const entry = document.createElement("article");
      entry.className = "guestbook-history-entry";

      const title = document.createElement("h5");
      title.textContent = `${event.reviewer_first_name} ${event.reviewer_last_name}`;

      const time = document.createElement("time");
      time.dateTime = event.created_at;
      time.textContent = formatHistoryDate(event.created_at);

      const actor = document.createElement("span");
      actor.className = "guestbook-history-actor";
      actor.textContent = event.moderator_email
        ? `Модератор: ${event.moderator_email}`
        : "Посетитель без входа";

      const action = document.createElement("p");
      action.className = "guestbook-history-action";
      action.textContent = actionLabels[event.action] || "Изменение отзыва";
      if (event.previous_value || event.new_value) {
        action.textContent += ` (${event.previous_value || "—"} → ${event.new_value || "—"})`;
      }

      const body = document.createElement("p");
      body.className = "guestbook-history-body";
      body.textContent = event.review_body;

      entry.append(title, time, actor, action, body);
      guestbookHistoryList.append(entry);
    });

    setMessage(guestbookHistoryFeedback, "");
  } catch (error) {
    reportError(guestbookHistoryFeedback, "Не удалось загрузить историю модерации.", error);
  }
}

async function updateReviewStatus(id, status) {
  setMessage(moderatorAdminFeedback, "Сохраняем решение…");
  try {
    const { error } = await supabase
      .from("guestbook_reviews")
      .update({ status })
      .eq("id", id)
      .select("id")
      .single();

    if (error) {
      reportError(moderatorAdminFeedback, "Не удалось изменить статус отзыва.", error);
      return;
    }

    await Promise.all([loadModerationReviews(), loadPublishedReviews(), loadModerationHistory()]);
  } catch (error) {
    reportError(moderatorAdminFeedback, "Не удалось изменить статус отзыва.", error);
  }
}

async function updateAvatarStatus(id, status) {
  setMessage(moderatorAdminFeedback, "Сохраняем решение по фото…");
  try {
    const { error } = await supabase
      .from("guestbook_reviews")
      .update({ avatar_image_status: status })
      .eq("id", id)
      .select("id")
      .single();

    if (error) {
      reportError(moderatorAdminFeedback, "Не удалось изменить статус фото аватара.", error);
      return;
    }

    await Promise.all([loadModerationReviews(), loadPublishedReviews(), loadModerationHistory()]);
  } catch (error) {
    reportError(moderatorAdminFeedback, "Не удалось изменить статус фото аватара.", error);
  }
}

async function deleteReview(id, avatarPath) {
  if (!window.confirm("Удалить этот отзыв без возможности восстановления?")) return;
  setMessage(moderatorAdminFeedback, "Удаляем отзыв…");
  try {
    const { error } = await supabase
      .from("guestbook_reviews")
      .delete()
      .eq("id", id)
      .select("id")
      .single();

    if (error) {
      reportError(moderatorAdminFeedback, "Не удалось удалить отзыв.", error);
      return;
    }

    let avatarCleanupError = null;
    if (avatarPath) {
      try {
        const { error: storageError } = await supabase.storage
          .from(AVATAR_BUCKET)
          .remove([avatarPath]);
        avatarCleanupError = storageError;
      } catch (error) {
        avatarCleanupError = error;
      }
    }

    await Promise.all([loadModerationReviews(), loadPublishedReviews(), loadModerationHistory()]);
    if (avatarCleanupError) {
      reportError(moderatorAdminFeedback, "Отзыв удалён, но фото не удалось удалить из хранилища.", avatarCleanupError);
    } else {
      setMessage(moderatorAdminFeedback, "Отзыв удалён.");
    }
  } catch (error) {
    reportError(moderatorAdminFeedback, "Не удалось удалить отзыв.", error);
  }
}

function setAdminSection(showHistory) {
  guestbookAdminReviews.hidden = showHistory;
  guestbookHistory.hidden = !showHistory;
}

function closeAdminMenu() {
  guestbookAdminMenu.hidden = true;
  moderatorMenuToggle.setAttribute("aria-expanded", "false");
  moderatorMenuToggle.setAttribute("aria-label", "Открыть меню модератора");
}

async function verifyModerator(session) {
  if (!session) {
    guestbookAdmin.hidden = true;
    guestbookLogin.hidden = false;
    closeAdminMenu();
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
      closeAdminMenu();
      setMessage(moderatorFeedback, "У этого аккаунта нет прав модератора.", true);
      return;
    }

    guestbookLogin.hidden = true;
    guestbookAdmin.hidden = false;
    setAdminSection(false);
    closeAdminMenu();
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

  guestbookAvatarFile.addEventListener("change", handleAvatarFileSelection);
  guestbookUseEmoji.addEventListener("click", () => {
    clearSelectedAvatarFile();
    setMessage(guestbookFeedback, "Выберите один из смайликов для аватара.");
  });

  guestbookForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!guestbookForm.reportValidity()) return;

    guestbookSubmit.disabled = true;
    setMessage(guestbookFeedback, "Отправляем отзыв на проверку…");
    const reviewId = crypto.randomUUID();
    try {
      const { error } = await supabase.from("guestbook_reviews").insert({
        id: reviewId,
        first_name: guestbookFirstName.value.trim(),
        last_name: guestbookLastName.value.trim(),
        body: guestbookReview.value.trim(),
        avatar_emoji: selectedEmoji,
        avatar_color: selectedColor,
        avatar_image_path: null,
        avatar_image_status: "none",
        consent: guestbookConsent.checked,
      });

      if (error) {
        reportError(guestbookFeedback, "Не удалось отправить отзыв. Попробуйте позже.", error);
        return;
      }

      let avatarUploadError = null;
      let photoSaved = false;
      if (selectedAvatarFile) {
        const extension = AVATAR_EXTENSIONS.get(selectedAvatarFile.type);
        const path = `${reviewId}/${crypto.randomUUID()}.${extension}`;
        try {
          const { error: uploadError } = await supabase.storage
            .from(AVATAR_BUCKET)
            .upload(path, selectedAvatarFile, {
              cacheControl: "60",
              contentType: selectedAvatarFile.type,
              upsert: false,
            });
          if (uploadError) throw uploadError;

          const { error: attachError } = await supabase.rpc("attach_guestbook_avatar", {
            p_review_id: reviewId,
            p_avatar_path: path,
          });
          if (attachError) throw attachError;
          photoSaved = true;
        } catch (error) {
          avatarUploadError = error;
          try {
            const { error: cleanupError } = await supabase.storage
              .from(AVATAR_BUCKET)
              .remove([path]);
            if (cleanupError) {
              console.error("Не удалось удалить фото после ошибки загрузки аватара.", cleanupError);
            }
          } catch (cleanupError) {
            console.error("Не удалось удалить фото после ошибки загрузки аватара.", cleanupError);
          }
        }
      }

      guestbookForm.reset();
      clearSelectedAvatarFile();
      selectedEmoji = AVATARS[0];
      selectedColor = AVATAR_COLORS[0];
      guestbookAvatarOptions.querySelectorAll("button").forEach((button) => {
        button.setAttribute("aria-pressed", String(button.textContent === selectedEmoji));
      });
      guestbookColorOptions.querySelectorAll("button").forEach((button) => {
        button.setAttribute("aria-pressed", String(button.classList.contains(`guestbook-avatar--${selectedColor}`)));
      });
      updateAvatarPreview();
      if (avatarUploadError) {
        reportError(
          guestbookFeedback,
          "Отзыв отправлен, но фото не загрузилось. Отзыв останется на проверке со смайликом.",
          avatarUploadError
        );
      } else {
        setMessage(
          guestbookFeedback,
          photoSaved
            ? "Спасибо! Отзыв и фото отправлены на проверку."
            : "Спасибо! Отзыв отправлен и появится после одобрения модератором."
        );
      }
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
        reportError(moderatorFeedback, getModeratorSignInErrorMessage(error), error);
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

  moderatorMenuToggle.addEventListener("click", () => {
    const shouldOpen = guestbookAdminMenu.hidden;
    guestbookAdminMenu.hidden = !shouldOpen;
    moderatorMenuToggle.setAttribute("aria-expanded", String(shouldOpen));
    moderatorMenuToggle.setAttribute(
      "aria-label",
      shouldOpen ? "Закрыть меню модератора" : "Открыть меню модератора"
    );
  });

  document.getElementById("moderatorMenuReviews").addEventListener("click", () => {
    setAdminSection(false);
    closeAdminMenu();
    loadModerationReviews();
  });

  document.getElementById("moderatorMenuHistory").addEventListener("click", () => {
    setAdminSection(true);
    closeAdminMenu();
    loadModerationHistory();
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
      closeAdminMenu();
      setMessage(moderatorFeedback, "Вы вышли из панели модерации.");
    } catch (error) {
      reportError(moderatorAdminFeedback, "Не удалось завершить сеанс модератора.", error);
    }
  });

  supabase.auth.onAuthStateChange((event, session) => {
    if (event === "SIGNED_OUT") {
      guestbookAdmin.hidden = true;
      guestbookLogin.hidden = false;
      closeAdminMenu();
    } else if (event === "INITIAL_SESSION" && session) {
      window.setTimeout(() => verifyModerator(session), 0);
    }
  });
}

initializeGuestbook().catch((error) => {
  reportError(guestbookLoadFeedback, "Не удалось подключить книгу отзывов.", error);
  guestbookSubmit.disabled = true;
});
