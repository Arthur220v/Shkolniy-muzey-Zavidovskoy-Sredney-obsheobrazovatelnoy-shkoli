const SUPABASE_MODULE_URL = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";
const AVATAR_BUCKET = "guestbook-avatars";
const MODERATOR_PROFILE_BUCKET = "guestbook-moderator-profile";
const MUSEUM_NEWS_BUCKET = "museum-news";
const MAX_AVATAR_SIZE = 3 * 1024 * 1024;
const MAX_NEWS_PHOTO_SIZE = 3 * 1024 * 1024;
const MAX_NEWS_PHOTOS = 6;
const MAX_NEWS_BODY_LENGTH = 6000;
const MAX_REVIEW_LENGTH = 1200;
const PUBLISHED_REVIEWS_PER_PAGE = 7;
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
const guestbookRatingOptions = document.getElementById("guestbookRatingOptions");
const guestbookConsent = document.getElementById("guestbookConsent");
const guestbookSubmit = document.getElementById("guestbookSubmit");
const guestbookAvatarOptions = document.getElementById("guestbookAvatarOptions");
const guestbookColorOptions = document.getElementById("guestbookColorOptions");
const guestbookCustomColorChoice = document.getElementById("guestbookCustomColorChoice");
const guestbookCustomColorPicker = document.getElementById("guestbookCustomColorPicker");
const guestbookAvatarPreview = document.getElementById("guestbookAvatarPreview");
const guestbookAvatarFile = document.getElementById("guestbookAvatarFile");
const guestbookUseEmoji = document.getElementById("guestbookUseEmoji");
const guestbookFeedback = document.getElementById("guestbookFeedback");
const guestbookLoadFeedback = document.getElementById("guestbookLoadFeedback");
const guestbookReviewList = document.getElementById("guestbookReviewList");
const guestbookPagination = document.getElementById("guestbookPagination");
const guestbookPageNumbers = document.getElementById("guestbookPageNumbers");
const guestbookPreviousPage = document.getElementById("guestbookPreviousPage");
const guestbookNextPage = document.getElementById("guestbookNextPage");
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
const guestbookAdminProfile = document.getElementById("guestbookAdminProfile");
const moderatorProfileForm = document.getElementById("guestbookModeratorProfileForm");
const moderatorProfileFirstName = document.getElementById("moderatorProfileFirstName");
const moderatorProfileLastName = document.getElementById("moderatorProfileLastName");
const moderatorProfilePhoto = document.getElementById("moderatorProfilePhoto");
const moderatorProfilePhotoPreview = document.getElementById("moderatorProfilePhotoPreview");
const moderatorProfileFeedback = document.getElementById("moderatorProfileFeedback");
const museumNewsList = document.getElementById("museumNewsList");
const museumNewsEmpty = document.getElementById("museumNewsEmpty");
const museumNewsPublicCreateButton = document.getElementById("museumNewsPublicCreateButton");
const museumNewsFeedback = document.getElementById("museumNewsFeedback");
const guestbookAdminNews = document.getElementById("guestbookAdminNews");
const guestbookAdminNewsArchive = document.getElementById("guestbookAdminNewsArchive");
const museumNewsAdminCreateButton = document.getElementById("museumNewsAdminCreateButton");
const museumNewsEditor = document.getElementById("museumNewsEditor");
const museumNewsBody = document.getElementById("museumNewsBody");
const museumNewsPhotosInput = document.getElementById("museumNewsPhotosInput");
const museumNewsPhotoPreviews = document.getElementById("museumNewsPhotoPreviews");
const museumNewsPublishButton = document.getElementById("museumNewsPublishButton");
const museumNewsCancelButton = document.getElementById("museumNewsCancelButton");
const museumNewsAdminList = document.getElementById("museumNewsAdminList");
const museumNewsAdminFeedback = document.getElementById("museumNewsAdminFeedback");
const museumNewsAdminListFeedback = document.getElementById("museumNewsAdminListFeedback");
const museumNewsArchiveList = document.getElementById("museumNewsArchiveList");
const museumNewsArchiveFeedback = document.getElementById("museumNewsArchiveFeedback");
const museumNewsLightbox = document.getElementById("museumNewsLightbox");
const museumNewsLightboxClose = document.getElementById("museumNewsLightboxClose");
const museumNewsLightboxImage = document.getElementById("museumNewsLightboxImage");
const museumNewsLightboxCaption = document.getElementById("museumNewsLightboxCaption");
const museumNewsLightboxPrev = document.getElementById("museumNewsLightboxPrev");
const museumNewsLightboxNext = document.getElementById("museumNewsLightboxNext");

let supabase;
let selectedEmoji = AVATARS[0];
let selectedColor = AVATAR_COLORS[0];
let selectedAvatarFile = null;
let selectedAvatarPreviewUrl = null;
let selectedRating = 0;
let hoveredRating = 0;
let publishedReviewPage = 1;
let moderatorUserId = null;
let moderatorProfile = null;
let moderatorProfilePhotoPreviewUrl = null;
let publicModeratorProfiles = new Map();
let selectedNewsPhotos = [];
let museumNewsGalleryPhotos = [];
let museumNewsGalleryIndex = 0;

function setMessage(element, message, isError = false, isSuccess = false) {
  if (isSuccess) element.classList.remove("is-success");
  element.textContent = message;
  element.classList.toggle("is-error", isError);
  element.classList.toggle("is-success", isSuccess);
  if (isSuccess) void element.offsetWidth;
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
  const isCustomColor = /^#[\da-f]{6}$/i.test(color);
  const isKnownColor = AVATAR_COLORS.includes(color);
  if (!isCustomColor && !isKnownColor) {
    console.error("Получен неизвестный цвет аватара.", color);
  }
  avatar.className = `guestbook-avatar ${isCustomColor
    ? "guestbook-avatar--custom"
    : `guestbook-avatar--${isKnownColor ? color : AVATAR_COLORS[0]}`}${photoUrl ? " guestbook-avatar--photo" : ""}`;
  if (isCustomColor) avatar.style.setProperty("--guestbook-avatar-custom-color", color);
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

function setSelectedColor(color) {
  selectedColor = color;
  guestbookColorOptions.querySelectorAll(".guestbook-color-choice").forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.color === color));
  });
  guestbookCustomColorChoice.classList.toggle("is-selected", color.startsWith("#"));
  if (color.startsWith("#")) {
    guestbookCustomColorChoice.style.setProperty("--guestbook-picker-color", color);
  }
  updateAvatarPreview();
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
    option.dataset.color = color;
    option.setAttribute("aria-label", `Цвет аватара: ${color}`);
    option.title = color;
    option.setAttribute("aria-pressed", String(color === selectedColor));
    option.addEventListener("click", () => {
      setSelectedColor(color);
    });
    guestbookColorOptions.append(option);
  });

  const updateCustomColor = () => setSelectedColor(guestbookCustomColorPicker.value.toLowerCase());
  guestbookCustomColorPicker.addEventListener("input", updateCustomColor);
  guestbookCustomColorPicker.addEventListener("change", updateCustomColor);
  guestbookColorOptions.append(guestbookCustomColorChoice);
  updateAvatarPreview();
}

function updateRatingChoices() {
  const activeRating = hoveredRating || selectedRating;
  guestbookRatingOptions.querySelectorAll('input[name="guestbookRating"]').forEach((input) => {
    const rating = Number(input.value);
    input.checked = rating === selectedRating;
    input.closest("label").classList.toggle("is-selected", rating <= activeRating);
  });
}

function createRatingChoices() {
  for (let rating = 1; rating <= 5; rating += 1) {
    const label = document.createElement("label");
    label.className = "guestbook-star-choice";

    const input = document.createElement("input");
    input.type = "radio";
    input.name = "guestbookRating";
    input.value = String(rating);
    input.required = rating === 1;
    input.setAttribute("aria-label", `${rating} из 5 звёзд`);
    input.addEventListener("change", () => {
      selectedRating = rating;
      updateRatingChoices();
    });
    label.addEventListener("pointerenter", () => {
      hoveredRating = rating;
      updateRatingChoices();
    });
    label.addEventListener("pointerleave", () => {
      hoveredRating = 0;
      updateRatingChoices();
    });
    label.addEventListener("focusin", () => {
      hoveredRating = rating;
      updateRatingChoices();
    });
    label.addEventListener("focusout", () => {
      hoveredRating = 0;
      updateRatingChoices();
    });

    const star = document.createElement("span");
    star.className = "guestbook-star-symbol";
    star.setAttribute("aria-hidden", "true");
    star.textContent = "★";
    label.append(input, star);
    guestbookRatingOptions.append(label);
  }
}

function createRatingDisplay(rating) {
  const score = Math.max(0, Math.min(5, Number(rating) || 0));
  const display = document.createElement("div");
  display.className = "guestbook-rating-display";
  display.setAttribute("role", "img");
  display.setAttribute("aria-label", `Оценка: ${score} из 5 звёзд`);
  for (let starIndex = 1; starIndex <= 5; starIndex += 1) {
    const star = document.createElement("span");
    star.setAttribute("aria-hidden", "true");
    star.textContent = starIndex <= score ? "★" : "☆";
    display.append(star);
  }
  return display;
}

function formatReviewDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${day}.${month}.${date.getFullYear()}`;
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

function formatModeratorLastSeen(value) {
  if (!value) return "Последний вход ещё не зафиксирован.";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Время последнего входа недоступно.";
  return `Последний вход: ${new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(date)}`;
}

function moderatorDisplayName(profile) {
  return profile?.firstName && profile?.lastName
    ? `${profile.firstName} ${profile.lastName}`
    : "Модератор";
}

function createModeratorProfileWidget(profile) {
  const fullName = moderatorDisplayName(profile);
  const widget = document.createElement("div");
  widget.className = "guestbook-moderator-profile";

  const trigger = document.createElement("button");
  trigger.type = "button";
  trigger.className = "guestbook-moderator-profile-trigger";
  trigger.textContent = fullName;
  trigger.setAttribute("aria-haspopup", "dialog");
  trigger.setAttribute("aria-expanded", "false");
  trigger.setAttribute("aria-label", `${fullName}, модератор. ${formatModeratorLastSeen(profile?.lastSeenAt)}`);

  const card = document.createElement("div");
  card.className = "guestbook-moderator-profile-card";
  card.setAttribute("role", "dialog");
  card.setAttribute("aria-label", `Профиль модератора: ${fullName}`);
  card.setAttribute("aria-hidden", "true");

  const photo = document.createElement(profile?.photoUrl ? "img" : "span");
  photo.className = "guestbook-moderator-profile-photo";
  if (profile?.photoUrl) {
    photo.src = profile.photoUrl;
    photo.alt = `Фото ${fullName}`;
    photo.loading = "lazy";
  } else {
    photo.setAttribute("aria-hidden", "true");
    photo.textContent = "🛡️";
  }

  const details = document.createElement("div");
  details.className = "guestbook-moderator-profile-details";
  const name = document.createElement("strong");
  name.textContent = fullName;
  const status = document.createElement("span");
  status.textContent = "Модератор";
  const lastSeen = document.createElement("time");
  lastSeen.textContent = formatModeratorLastSeen(profile?.lastSeenAt);
  if (profile?.lastSeenAt) lastSeen.dateTime = profile.lastSeenAt;
  details.append(name, status, lastSeen);

  const closeButton = document.createElement("button");
  closeButton.type = "button";
  closeButton.className = "guestbook-moderator-profile-close";
  closeButton.textContent = "×";
  closeButton.setAttribute("aria-label", "Закрыть профиль модератора");
  card.append(photo, details, closeButton);
  widget.append(trigger, card);

  const placeModeratorProfileCard = () => {
    const triggerRect = trigger.getBoundingClientRect();
    const cardWidth = Math.min(330, window.innerWidth - 24);
    let left = triggerRect.left;
    left = Math.max(12, Math.min(left, window.innerWidth - cardWidth - 12));

    const estimatedHeight = card.offsetHeight || 130;
    let top = triggerRect.bottom + 8;
    if (top + estimatedHeight > window.innerHeight - 12) {
      top = Math.max(12, triggerRect.top - estimatedHeight - 8);
    }

    card.style.setProperty("--moderator-profile-top", `${top}px`);
    card.style.setProperty("--moderator-profile-left", `${left}px`);
  };

  const setOpen = (open, dismissed = false) => {
    widget.classList.toggle("is-open", open);
    widget.classList.toggle("is-dismissed", dismissed);
    trigger.setAttribute("aria-expanded", String(open));
    card.setAttribute("aria-hidden", String(!open));
    if (open) window.requestAnimationFrame(placeModeratorProfileCard);
  };
  trigger.addEventListener("click", () => {
    const opening = !widget.classList.contains("is-open");
    setOpen(opening);
  });
  closeButton.addEventListener("click", () => setOpen(false, true));
  widget.addEventListener("pointerenter", (event) => {
    if (event.pointerType === "mouse" && !widget.classList.contains("is-dismissed")) {
      trigger.setAttribute("aria-expanded", "true");
      card.setAttribute("aria-hidden", "false");
      window.requestAnimationFrame(placeModeratorProfileCard);
    }
  });
  trigger.addEventListener("focus", () => {
    if (!widget.classList.contains("is-open")) {
      widget.classList.remove("is-dismissed");
      trigger.setAttribute("aria-expanded", "true");
      card.setAttribute("aria-hidden", "false");
      window.requestAnimationFrame(placeModeratorProfileCard);
    }
  });
  widget.addEventListener("focusout", (event) => {
    if (!widget.contains(event.relatedTarget) && !widget.classList.contains("is-open")) {
      trigger.setAttribute("aria-expanded", "false");
      card.setAttribute("aria-hidden", "true");
    }
  });
  widget.addEventListener("pointerleave", (event) => {
    if (event.pointerType === "mouse") {
      widget.classList.remove("is-dismissed");
      if (!widget.classList.contains("is-open") && !widget.contains(document.activeElement)) {
        trigger.setAttribute("aria-expanded", "false");
        card.setAttribute("aria-hidden", "true");
      }
    }
  });
  widget.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && (widget.classList.contains("is-open") || widget.matches(":hover"))) {
      setOpen(false, true);
      trigger.focus();
    }
  });
  window.addEventListener("resize", () => {
    if (trigger.getAttribute("aria-expanded") === "true") {
      placeModeratorProfileCard();
    }
  });
  window.addEventListener("scroll", () => {
    if (trigger.getAttribute("aria-expanded") === "true") {
      placeModeratorProfileCard();
    }
  }, { passive: true });
  return widget;
}

function createReviewCard(review, isModeration = false, photoUrl = null) {
  const card = document.createElement("article");
  card.className = [
    "guestbook-review",
    isModeration ? "guestbook-review--moderation" : "",
    review.is_featured ? "guestbook-review--featured" : "",
    review.is_first_review ? "guestbook-review--first" : "",
  ].filter(Boolean).join(" ");

  const header = document.createElement("div");
  header.className = "guestbook-review-header";
  header.append(makeAvatar(review.avatar_emoji, review.avatar_color, "Аватар автора отзыва", photoUrl));

  const identity = document.createElement("div");
  identity.className = "guestbook-review-identity";
  const name = document.createElement("h3");
  name.textContent = `${review.first_name} ${review.last_name}`;
  const nameLine = document.createElement("div");
  nameLine.className = "guestbook-review-name-line";
  nameLine.append(name);
  if (review.is_first_review) {
    const firstReviewBadge = document.createElement("span");
    firstReviewBadge.className = "guestbook-first-review-badge";
    firstReviewBadge.textContent = "Самый первый отзыв";
    nameLine.append(firstReviewBadge);
  }
  identity.append(nameLine);

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
  card.append(header, createRatingDisplay(review.rating), body);
  if (review.is_featured) {
    const featuredBadge = document.createElement("span");
    featuredBadge.className = "guestbook-featured-badge";
    featuredBadge.textContent = "Самый ценный отзыв";
    card.append(featuredBadge);
  }

  if (isModeration) {
    if (review.status !== "approved") card.append(createModeratorReplyEditor(review));
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
  } else {
    if (review.moderator_reply || moderatorUserId) card.append(createPublicModeratorReply(review));
    if (moderatorUserId) card.append(createPublishedReviewActions(review));
    card.append(createVoteControls(review));
  }

  return card;
}

function createPublicModeratorReply(review) {
  const profileId = review.moderator_user_id || (moderatorUserId && !review.moderator_reply ? moderatorUserId : null);
  const profile = publicModeratorProfiles.get(profileId);
  const reply = document.createElement("section");
  reply.className = "guestbook-moderator-reply";
  reply.setAttribute("aria-label", "Ответ модератора");

  const header = document.createElement("div");
  header.className = "guestbook-moderator-reply-header";
  header.append(
    makeAvatar(
      "🛡️",
      "gold",
      "Аватар модератора",
      profile?.photoUrl || null
    )
  );

  const identity = document.createElement("div");
  identity.className = "guestbook-review-identity";
  const profileStatus = document.createElement("span");
  profileStatus.className = "guestbook-moderator-status";
  profileStatus.textContent = "Модератор";
  identity.append(createModeratorProfileWidget(profile), profileStatus);

  header.append(identity);
  if (review.moderator_reply) {
    const time = document.createElement("time");
    time.dateTime = review.moderator_replied_at;
    time.textContent = formatReviewDate(review.moderator_replied_at);
    header.append(time);

    const body = document.createElement("p");
    body.className = "guestbook-moderator-reply-body";
    body.textContent = review.moderator_reply;
    reply.append(header, body);
  } else {
    const prompt = document.createElement("p");
    prompt.className = "guestbook-moderator-reply-body";
    prompt.textContent = "Ответа модератора пока нет.";
    reply.append(header, prompt);
  }

  if (moderatorUserId) {
    const editButton = document.createElement("button");
    editButton.type = "button";
    editButton.className = "guestbook-reply-edit-button guestbook-secondary-button";
    editButton.textContent = "✎";
    editButton.setAttribute(
      "aria-label",
      review.moderator_reply ? "Редактировать ответ модератора" : "Добавить ответ модератора"
    );
    editButton.title = review.moderator_reply ? "Редактировать ответ" : "Добавить ответ";
    editButton.addEventListener("click", () => {
      reply.replaceWith(createPublicModeratorReplyEditor(review));
    });
    header.append(editButton);
  }
  return reply;
}

function createPublicModeratorReplyEditor(review) {
  const wrapper = document.createElement("section");
  wrapper.className = "guestbook-moderator-reply guestbook-public-reply-editor";
  wrapper.setAttribute("aria-label", "Редактирование ответа модератора");

  const label = document.createElement("label");
  label.className = "guestbook-field";
  const labelText = document.createElement("span");
  labelText.textContent = "Ответ модератора";
  const textarea = document.createElement("textarea");
  textarea.rows = 3;
  textarea.maxLength = MAX_REVIEW_LENGTH;
  textarea.value = review.moderator_reply || "";
  textarea.setAttribute("aria-label", `Ответ на отзыв ${review.first_name} ${review.last_name}`);
  label.append(labelText, textarea);

  const actions = document.createElement("div");
  actions.className = "guestbook-review-actions";

  const saveButton = document.createElement("button");
  saveButton.type = "button";
  saveButton.className = "guestbook-secondary-button";
  saveButton.textContent = review.moderator_reply ? "Сохранить ответ" : "Опубликовать ответ";
  saveButton.disabled = !textarea.value.trim();
  textarea.addEventListener("input", () => {
    saveButton.disabled = !textarea.value.trim();
  });
  saveButton.addEventListener("click", () => saveModeratorReply(review.id, textarea, saveButton));
  actions.append(saveButton);

  const cancelButton = document.createElement("button");
  cancelButton.type = "button";
  cancelButton.className = "guestbook-secondary-button";
  cancelButton.textContent = "Отмена";
  cancelButton.addEventListener("click", () => {
    wrapper.replaceWith(createPublicModeratorReply(review));
  });
  actions.append(cancelButton);

  if (review.moderator_reply) {
    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "guestbook-secondary-button guestbook-secondary-button--danger";
    deleteButton.textContent = "Удалить ответ";
    deleteButton.addEventListener("click", () => {
      if (!window.confirm("Удалить ответ модератора?")) return;
      textarea.value = "";
      saveModeratorReply(review.id, textarea, deleteButton);
    });
    actions.append(deleteButton);
  }

  wrapper.append(label, actions);
  return wrapper;
}

function createPublishedReviewActions(review) {
  const actions = document.createElement("div");
  actions.className = "guestbook-review-actions guestbook-published-review-actions";

  const featuredButton = document.createElement("button");
  featuredButton.type = "button";
  featuredButton.className = "guestbook-secondary-button guestbook-featured-action";
  featuredButton.textContent = review.is_featured
    ? "Снять статус «Самый ценный отзыв»"
    : "Самый ценный отзыв";
  featuredButton.setAttribute("aria-pressed", String(Boolean(review.is_featured)));
  featuredButton.addEventListener("click", () => updateReviewFeatured(review.id, !review.is_featured));

  actions.append(featuredButton, createDeleteAction(review.id, review.avatar_image_path));
  return actions;
}

function createModeratorReplyEditor(review) {
  const wrapper = document.createElement("div");
  wrapper.className = "guestbook-reply-editor";

  const label = document.createElement("label");
  label.className = "guestbook-field";
  const labelText = document.createElement("span");
  labelText.textContent = "Ответ модератора";
  const textarea = document.createElement("textarea");
  textarea.rows = 3;
  textarea.maxLength = MAX_REVIEW_LENGTH;
  textarea.value = review.moderator_reply || "";
  textarea.setAttribute("aria-label", `Ответ на отзыв ${review.first_name} ${review.last_name}`);
  label.append(labelText, textarea);

  const saveButton = document.createElement("button");
  saveButton.type = "button";
  saveButton.className = "guestbook-secondary-button";
  saveButton.textContent = review.moderator_reply ? "Сохранить ответ" : "Ответить";
  saveButton.addEventListener("click", () => saveModeratorReply(review.id, textarea, saveButton));
  wrapper.append(label, saveButton);
  return wrapper;
}

function createVoteControls(review) {
  const controls = document.createElement("div");
  controls.className = "guestbook-vote-controls";
  controls.setAttribute("aria-label", "Оценка отзыва");

  [
    { vote: 1, label: "Нравится", symbol: "👍", count: review.likes || 0 },
    { vote: -1, label: "Не нравится", symbol: "👎", count: review.dislikes || 0 },
  ].forEach(({ vote, label, symbol, count }) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "guestbook-vote-button";
    button.setAttribute("aria-label", `${label}: ${count}`);
    button.setAttribute("aria-pressed", String(review.myVote === vote));
    const icon = document.createElement("span");
    icon.setAttribute("aria-hidden", "true");
    icon.textContent = symbol;
    const tally = document.createElement("span");
    tally.textContent = String(count);
    button.append(icon, tally);
    button.addEventListener("click", () => castReviewVote(review.id, vote, review.myVote, controls));
    controls.append(button);
  });

  return controls;
}

function getVoterId() {
  const storageKey = "museumGuestbookVoterId";
  let voterId = window.localStorage.getItem(storageKey);
  if (!voterId) {
    voterId = crypto.randomUUID();
    window.localStorage.setItem(storageKey, voterId);
  }
  return voterId;
}

function getStoredVote(reviewId) {
  try {
    const vote = Number(window.localStorage.getItem(`museumGuestbookVote:${reviewId}`));
    return vote === 1 || vote === -1 ? vote : 0;
  } catch (error) {
    console.error("Не удалось прочитать сохранённую реакцию.", error);
    return 0;
  }
}

async function castReviewVote(reviewId, vote, currentVote, controls) {
  controls.querySelectorAll("button").forEach((button) => {
    button.disabled = true;
  });
  try {
    const voterId = getVoterId();
    const nextVote = currentVote === vote ? 0 : vote;
    const { error } = await supabase.rpc("cast_guestbook_vote", {
      p_review_id: reviewId,
      p_voter_id: voterId,
      p_vote: nextVote,
    });
    if (error) throw error;

    const voteKey = `museumGuestbookVote:${reviewId}`;
    if (nextVote) {
      window.localStorage.setItem(voteKey, String(nextVote));
    } else {
      window.localStorage.removeItem(voteKey);
    }
    await loadPublishedReviews();
  } catch (error) {
    reportError(guestbookLoadFeedback, "Не удалось сохранить реакцию на отзыв.", error);
    controls.querySelectorAll("button").forEach((button) => {
      button.disabled = false;
    });
  }
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

async function fetchModeratorProfiles(moderatorIds) {
  const ids = [...new Set(moderatorIds)].filter(Boolean);
  if (!ids.length) return new Map();

  const { data, error } = await supabase
    .from("guestbook_moderator_profile")
    .select("profile_first_name, profile_last_name, profile_image_path, user_id, last_seen_at")
    .in("user_id", ids);
  if (error) throw error;

  const profiles = new Map((data || []).map((profile) => [profile.user_id, {
    firstName: profile.profile_first_name,
    lastName: profile.profile_last_name,
    photoPath: profile.profile_image_path,
    photoUrl: null,
    lastSeenAt: profile.last_seen_at,
  }]));
  for (const profile of profiles.values()) {
    if (!profile.photoPath) continue;
    const { data: signedPhoto, error: photoError } = await supabase.storage
      .from(MODERATOR_PROFILE_BUCKET)
      .createSignedUrl(profile.photoPath, 3600);
    if (photoError) throw photoError;
    profile.photoUrl = signedPhoto.signedUrl;
  }
  return profiles;
}

async function prepareReviewCards(reviews, isModeration, feedbackElement) {
  let photoFailures = 0;
  if (!isModeration) {
    publicModeratorProfiles = new Map();
    const moderatorIds = new Set(
      reviews.map((review) => review.moderator_user_id).filter(Boolean)
    );
    if (moderatorUserId) moderatorIds.add(moderatorUserId);
    if (moderatorIds.size) {
      try {
        publicModeratorProfiles = await fetchModeratorProfiles(moderatorIds);
      } catch (error) {
        photoFailures += 1;
        console.error("Не удалось загрузить публичный профиль модератора.", error);
      }
    }
  }

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
    setMessage(feedbackElement, "Отзывы загружены, но некоторые фото профиля или аватары открыть не удалось.", true);
  }
  return cards;
}

function formatMuseumNewsDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function appendMuseumNewsText(container, text) {
  const hashtagPattern = /#[\p{L}\p{N}_]+/gu;
  let currentIndex = 0;
  for (const match of text.matchAll(hashtagPattern)) {
    if (match.index > currentIndex) {
      container.append(document.createTextNode(text.slice(currentIndex, match.index)));
    }
    const hashtag = document.createElement("span");
    hashtag.className = "museum-news-hashtag";
    hashtag.textContent = match[0];
    container.append(hashtag);
    currentIndex = match.index + match[0].length;
  }
  if (currentIndex < text.length) {
    container.append(document.createTextNode(text.slice(currentIndex)));
  }
}

function createMuseumNewsReactionIcon(reaction) {
  const namespace = "http://www.w3.org/2000/svg";
  const icon = document.createElementNS(namespace, "svg");
  icon.setAttribute("viewBox", "0 0 24 24");
  icon.setAttribute("aria-hidden", "true");
  const appendShape = (tagName, attributes) => {
    const shape = document.createElementNS(namespace, tagName);
    Object.entries(attributes).forEach(([name, value]) => shape.setAttribute(name, value));
    icon.append(shape);
  };

  if (reaction === "heart") {
    appendShape("path", {
      d: "M20.8 4.7a5.6 5.6 0 0 0-7.9 0L12 5.6l-.9-.9a5.6 5.6 0 0 0-7.9 7.9l.9.9L12 21l7.9-7.5.9-.9a5.6 5.6 0 0 0 0-7.9Z",
      fill: "currentColor",
    });
  } else if (reaction === "surprised") {
    appendShape("circle", {
      cx: "12",
      cy: "12",
      r: "9.2",
      fill: "none",
      stroke: "currentColor",
      "stroke-width": "1.8",
    });
    appendShape("circle", { cx: "9", cy: "10", r: "1.15", fill: "currentColor" });
    appendShape("circle", { cx: "15", cy: "10", r: "1.15", fill: "currentColor" });
    appendShape("ellipse", {
      cx: "12",
      cy: "15",
      rx: "1.25",
      ry: "1.8",
      fill: "none",
      stroke: "currentColor",
      "stroke-width": "1.6",
    });
  } else {
    appendShape("path", {
      d: "M3 14.5c2.4-.2 4.4-1.3 6-3.1l1.5-1.8 1.2-5.3 2.4 4.2 6.7.7-4.9 2.6 2.5 6.6-5.3-3.2-3.4 4.1-.6-4.1-6.1-.7Zm6.2-3.1 4.1 2.2",
      fill: "currentColor",
    });
  }
  return icon;
}

function getStoredMuseumNewsReaction(newsId) {
  try {
    const value = window.localStorage.getItem(`museumNewsReaction:${newsId}`);
    return ["heart", "surprised", "dove"].includes(value) ? value : null;
  } catch (error) {
    console.error("Не удалось прочитать сохранённую реакцию на новость.", error);
    return null;
  }
}

function createMuseumNewsReactionControls(news, counts) {
  const controls = document.createElement("div");
  controls.className = "museum-news-reactions";
  controls.setAttribute("aria-label", "Реакции на новость");
  const currentReaction = getStoredMuseumNewsReaction(news.id);

  [
    { reaction: "heart", label: "Сердце", count: counts.hearts || 0 },
    { reaction: "surprised", label: "Удивление", count: counts.surprised || 0 },
    { reaction: "dove", label: "Белый голубь", count: counts.doves || 0 },
  ].forEach(({ reaction, label, count }) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "museum-news-reaction";
    button.dataset.reaction = reaction;
    button.setAttribute("aria-label", `${label}: ${count}`);
    button.setAttribute("aria-pressed", String(currentReaction === reaction));
    const amount = document.createElement("span");
    amount.textContent = String(count);
    button.append(createMuseumNewsReactionIcon(reaction), amount);
    button.addEventListener("click", () => updateMuseumNewsReaction(news.id, reaction, currentReaction, controls));
    controls.append(button);
  });
  return controls;
}

function createMuseumNewsManageActions(news, archived) {
  const actions = document.createElement("div");
  actions.className = "museum-news-manage-actions";
  const statusButton = document.createElement("button");
  statusButton.type = "button";
  statusButton.className = "guestbook-secondary-button";
  statusButton.textContent = archived ? "Опубликовать снова" : "В архив";
  statusButton.addEventListener("click", () => setMuseumNewsStatus(
    news.id,
    archived ? "published" : "archived",
    archived
  ));
  const deleteButton = document.createElement("button");
  deleteButton.type = "button";
  deleteButton.className = "guestbook-secondary-button guestbook-secondary-button--danger";
  deleteButton.textContent = "Удалить";
  deleteButton.addEventListener("click", () => deleteMuseumNews(news.id, archived));
  actions.append(statusButton, deleteButton);
  return actions;
}

function createMuseumNewsCard(news, {
  photos = [],
  counts = {},
  profile = null,
  archived = false,
  manage = false,
  showReactions = true,
} = {}) {
  const card = document.createElement("article");
  card.className = `museum-news-card${archived ? " museum-news-card--archived" : ""}`;

  const header = document.createElement("header");
  header.className = "museum-news-card-header";
  const publicationTime = document.createElement("time");
  publicationTime.dateTime = news.published_at;
  publicationTime.textContent = formatMuseumNewsDate(news.published_at);
  header.append(publicationTime);
  if (archived) {
    const archivedLabel = document.createElement("span");
    archivedLabel.className = "museum-news-archived-label";
    archivedLabel.textContent = "В архиве";
    header.append(archivedLabel);
  }

  const photoGallery = document.createElement("div");
  photoGallery.className = "museum-news-photo-gallery";
  photos.forEach((photo, index) => {
    const photoButton = document.createElement("button");
    photoButton.type = "button";
    photoButton.className = "museum-news-photo";
    photoButton.setAttribute("aria-label", `Открыть фотографию ${index + 1} в полном размере`);
    const image = document.createElement("img");
    image.src = photo.signedUrl;
    image.alt = `Фотография новости, ${index + 1}`;
    image.loading = "lazy";
    photoButton.append(image);
    photoButton.addEventListener("click", () => openMuseumNewsLightbox(photos, index));
    photoGallery.append(photoButton);
  });

  const body = document.createElement("p");
  body.className = "museum-news-body";
  appendMuseumNewsText(body, news.body);
  card.append(header);
  if (photos.length) card.append(photoGallery);
  card.append(body);
  if (!archived && showReactions) card.append(createMuseumNewsReactionControls(news, counts));
  if (manage) card.append(createMuseumNewsManageActions(news, archived));

  const author = document.createElement("footer");
  author.className = "museum-news-author";
  const authorLabel = document.createElement("span");
  authorLabel.textContent = "Автор:";
  author.append(authorLabel, createModeratorProfileWidget(profile));
  card.append(author);
  return card;
}

async function fetchMuseumNewsPhotos(newsIds) {
  if (!newsIds.length) return new Map();
  const { data, error } = await supabase
    .from("museum_news_photos")
    .select("news_id, storage_path, sort_order")
    .in("news_id", newsIds)
    .order("sort_order", { ascending: true });
  if (error) throw error;

  const photosByNewsId = new Map(newsIds.map((id) => [id, []]));
  for (const photo of data || []) {
    const { data: signedPhoto, error: photoError } = await supabase.storage
      .from(MUSEUM_NEWS_BUCKET)
      .createSignedUrl(photo.storage_path, 3600);
    if (photoError) throw photoError;
    photosByNewsId.get(photo.news_id).push({
      signedUrl: signedPhoto.signedUrl,
      sortOrder: photo.sort_order,
    });
  }
  return photosByNewsId;
}

async function fetchMuseumNewsCounts(newsIds) {
  if (!newsIds.length) return new Map();
  const { data, error } = await supabase
    .from("museum_news_reaction_counts")
    .select("news_id, hearts, surprised, doves")
    .in("news_id", newsIds);
  if (error) throw error;
  return new Map((data || []).map((counts) => [counts.news_id, counts]));
}

function getMuseumNewsVoterId() {
  const storageKey = "museumNewsVoterId";
  try {
    let voterId = window.localStorage.getItem(storageKey);
    if (!voterId) {
      voterId = crypto.randomUUID();
      window.localStorage.setItem(storageKey, voterId);
    }
    return voterId;
  } catch (error) {
    throw new Error("Не удалось сохранить идентификатор реакции в этом браузере.", { cause: error });
  }
}

async function updateMuseumNewsReaction(newsId, reaction, currentReaction, controls) {
  controls.querySelectorAll("button").forEach((button) => {
    button.disabled = true;
  });
  let reactionSaved = false;
  try {
    const nextReaction = currentReaction === reaction ? null : reaction;
    const { error } = await supabase.rpc("set_museum_news_reaction", {
      p_news_id: newsId,
      p_voter_id: getMuseumNewsVoterId(),
      p_reaction: nextReaction,
    });
    if (error) throw error;
    reactionSaved = true;

    const key = `museumNewsReaction:${newsId}`;
    try {
      if (nextReaction) window.localStorage.setItem(key, nextReaction);
      else window.localStorage.removeItem(key);
    } catch (error) {
      console.error("Реакция сохранена на сервере, но выбор не удалось сохранить в этом браузере.", error);
      await loadPublishedMuseumNews();
      setMessage(
        museumNewsFeedback,
        "Реакция сохранена, но браузер не запомнил ваш выбор. В этом браузере не получится снять её повторным нажатием.",
        true
      );
      controls.querySelectorAll("button").forEach((button) => {
        button.disabled = false;
      });
      return;
    }
    await loadPublishedMuseumNews();
  } catch (error) {
    reportError(
      museumNewsFeedback,
      reactionSaved ? "Реакция сохранена, но не удалось обновить список новостей." : "Не удалось сохранить реакцию на новость.",
      error
    );
    controls.querySelectorAll("button").forEach((button) => {
      button.disabled = false;
    });
  }
}

async function loadPublishedMuseumNews() {
  setMessage(museumNewsFeedback, "Загружаем новости…");
  try {
    const { data: news, error } = await supabase
      .from("museum_news")
      .select("id, body, moderator_user_id, published_at")
      .eq("status", "published")
      .order("published_at", { ascending: false });
    if (error) throw error;

    museumNewsList.replaceChildren();
    museumNewsEmpty.hidden = Boolean(news?.length);
    museumNewsPublicCreateButton.hidden = Boolean(!moderatorUserId || news?.length);
    if (!news?.length) {
      setMessage(museumNewsFeedback, "");
      return;
    }

    const newsIds = news.map((item) => item.id);
    const moderatorIds = news.map((item) => item.moderator_user_id).filter(Boolean);
    const [photosByNewsId, countsByNewsId, profiles] = await Promise.all([
      fetchMuseumNewsPhotos(newsIds),
      fetchMuseumNewsCounts(newsIds),
      fetchModeratorProfiles(moderatorIds),
    ]);
    museumNewsList.replaceChildren(...news.map((item) => createMuseumNewsCard(item, {
      photos: photosByNewsId.get(item.id) || [],
      counts: countsByNewsId.get(item.id) || {},
      profile: profiles.get(item.moderator_user_id) || null,
    })));
    setMessage(museumNewsFeedback, "");
  } catch (error) {
    reportError(museumNewsFeedback, "Не удалось загрузить новости музея.", error);
  }
}

async function loadModeratorMuseumNews(status = "published") {
  const isArchived = status === "archived";
  const newsList = isArchived ? museumNewsArchiveList : museumNewsAdminList;
  const feedback = isArchived ? museumNewsArchiveFeedback : museumNewsAdminListFeedback;
  setMessage(feedback, "Загружаем новости…");
  try {
    const { data: news, error } = await supabase
      .from("museum_news")
      .select("id, body, moderator_user_id, published_at")
      .eq("status", status)
      .order("published_at", { ascending: false });
    if (error) throw error;
    newsList.replaceChildren();
    if (!news?.length) {
      setMessage(feedback, isArchived ? "Архив новостей пуст." : "Опубликованных новостей пока нет.");
      return;
    }

    const newsIds = news.map((item) => item.id);
    const [photosByNewsId, profiles] = await Promise.all([
      fetchMuseumNewsPhotos(newsIds),
      fetchModeratorProfiles(news.map((item) => item.moderator_user_id).filter(Boolean)),
    ]);
    newsList.replaceChildren(...news.map((item) => createMuseumNewsCard(item, {
      photos: photosByNewsId.get(item.id) || [],
      profile: profiles.get(item.moderator_user_id) || null,
      archived: isArchived,
      manage: true,
      showReactions: false,
    })));
    setMessage(feedback, "");
  } catch (error) {
    reportError(feedback, "Не удалось загрузить список новостей для модератора.", error);
  }
}

async function setMuseumNewsStatus(newsId, status, wasArchived = false) {
  const feedback = wasArchived ? museumNewsArchiveFeedback : museumNewsAdminListFeedback;
  setMessage(feedback, status === "archived" ? "Переносим новость в архив…" : "Публикуем новость…");
  try {
    const update = { status };
    if (status === "published") update.published_at = new Date().toISOString();
    const { error } = await supabase
      .from("museum_news")
      .update(update)
      .eq("id", newsId)
      .select("id")
      .single();
    if (error) throw error;
    await Promise.all([
      loadPublishedMuseumNews(),
      loadModeratorMuseumNews("published"),
      loadModeratorMuseumNews("archived"),
    ]);
  } catch (error) {
    reportError(feedback, "Не удалось изменить публикацию новости.", error);
  }
}

async function deleteMuseumNews(newsId, wasArchived = false) {
  if (!window.confirm("Удалить новость и её фотографии без возможности восстановления?")) return;
  const feedback = wasArchived ? museumNewsArchiveFeedback : museumNewsAdminListFeedback;
  setMessage(feedback, "Удаляем новость…");
  try {
    const { data: photos, error: photosError } = await supabase
      .from("museum_news_photos")
      .select("storage_path")
      .eq("news_id", newsId);
    if (photosError) throw photosError;

    const { error } = await supabase
      .from("museum_news")
      .delete()
      .eq("id", newsId)
      .select("id")
      .single();
    if (error) throw error;

    let storageError = null;
    if (photos?.length) {
      try {
        const { error: removeError } = await supabase.storage
          .from(MUSEUM_NEWS_BUCKET)
          .remove(photos.map((photo) => photo.storage_path));
        storageError = removeError;
      } catch (error) {
        storageError = error;
      }
    }
    await Promise.all([
      loadPublishedMuseumNews(),
      loadModeratorMuseumNews("published"),
      loadModeratorMuseumNews("archived"),
    ]);
    if (storageError) {
      reportError(feedback, "Новость удалена, но не все её фотографии удалось удалить из хранилища.", storageError);
    } else {
      setMessage(feedback, "Новость удалена.");
    }
  } catch (error) {
    reportError(feedback, "Не удалось удалить новость.", error);
  }
}

function openMuseumNewsLightbox(photos, index) {
  museumNewsGalleryPhotos = photos;
  museumNewsGalleryIndex = index;
  updateMuseumNewsLightbox();
  if (!museumNewsLightbox.open) museumNewsLightbox.showModal();
}

function updateMuseumNewsLightbox() {
  const photo = museumNewsGalleryPhotos[museumNewsGalleryIndex];
  if (!photo) return;
  museumNewsLightboxImage.src = photo.signedUrl;
  museumNewsLightboxImage.alt = `Фотография ${museumNewsGalleryIndex + 1} из ${museumNewsGalleryPhotos.length}`;
  museumNewsLightboxCaption.textContent = `${museumNewsGalleryIndex + 1} / ${museumNewsGalleryPhotos.length}`;
  const hasMultiple = museumNewsGalleryPhotos.length > 1;
  museumNewsLightboxPrev.hidden = !hasMultiple;
  museumNewsLightboxNext.hidden = !hasMultiple;
}

function moveMuseumNewsLightbox(direction) {
  if (museumNewsGalleryPhotos.length < 2) return;
  museumNewsGalleryIndex = (
    museumNewsGalleryIndex + direction + museumNewsGalleryPhotos.length
  ) % museumNewsGalleryPhotos.length;
  updateMuseumNewsLightbox();
}

function clearMuseumNewsPhotoSelection() {
  selectedNewsPhotos.forEach((photo) => URL.revokeObjectURL(photo.previewUrl));
  selectedNewsPhotos = [];
  museumNewsPhotosInput.value = "";
  museumNewsPhotoPreviews.replaceChildren();
}

function renderMuseumNewsPhotoPreviews() {
  museumNewsPhotoPreviews.replaceChildren();
  selectedNewsPhotos.forEach((photo, index) => {
    const item = document.createElement("div");
    item.className = "museum-news-photo-preview";
    const image = document.createElement("img");
    image.src = photo.previewUrl;
    image.alt = `Выбранная фотография ${index + 1}`;
    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.textContent = "×";
    removeButton.setAttribute("aria-label", `Убрать фотографию ${index + 1}`);
    removeButton.addEventListener("click", () => {
      URL.revokeObjectURL(photo.previewUrl);
      selectedNewsPhotos.splice(index, 1);
      renderMuseumNewsPhotoPreviews();
    });
    item.append(image, removeButton);
    museumNewsPhotoPreviews.append(item);
  });
}

function handleMuseumNewsPhotoSelection() {
  const files = Array.from(museumNewsPhotosInput.files || []);
  clearMuseumNewsPhotoSelection();
  if (files.length > MAX_NEWS_PHOTOS) {
    setMessage(museumNewsAdminFeedback, `Можно выбрать не более ${MAX_NEWS_PHOTOS} фотографий.`, true);
    return;
  }
  const invalidFile = files.find((file) => !AVATAR_EXTENSIONS.has(file.type) || file.size > MAX_NEWS_PHOTO_SIZE);
  if (invalidFile) {
    const message = AVATAR_EXTENSIONS.has(invalidFile.type)
      ? "Размер одной фотографии не должен превышать 3 МБ."
      : "Для новостей подходят фотографии JPG, PNG или WebP.";
    setMessage(museumNewsAdminFeedback, message, true);
    return;
  }

  selectedNewsPhotos = files.map((file) => ({
    file,
    previewUrl: URL.createObjectURL(file),
  }));
  renderMuseumNewsPhotoPreviews();
  setMessage(
    museumNewsAdminFeedback,
    files.length ? `Выбрано фотографий: ${files.length}.` : ""
  );
}

function openMuseumNewsComposer() {
  if (!moderatorUserId) return;
  guestbookModerator.open = true;
  setAdminSection("news");
  museumNewsEditor.hidden = false;
  museumNewsBody.value = "";
  clearMuseumNewsPhotoSelection();
  setMessage(museumNewsAdminFeedback, "");
  guestbookAdmin.scrollIntoView({ behavior: "smooth", block: "start" });
  window.setTimeout(() => museumNewsBody.focus(), 0);
}

function closeMuseumNewsComposer() {
  museumNewsEditor.hidden = true;
  museumNewsBody.value = "";
  clearMuseumNewsPhotoSelection();
  setMessage(museumNewsAdminFeedback, "");
}

async function publishMuseumNews(event) {
  event.preventDefault();
  if (!moderatorUserId) return;
  if (!museumNewsEditor.reportValidity()) return;

  const body = museumNewsBody.value.trim();
  if (!body || body.length > MAX_NEWS_BODY_LENGTH) {
    setMessage(museumNewsAdminFeedback, "Добавьте текст новости длиной не более 6000 символов.", true);
    return;
  }

  museumNewsPublishButton.disabled = true;
  museumNewsCancelButton.disabled = true;
  museumNewsBody.disabled = true;
  museumNewsPhotosInput.disabled = true;
  museumNewsPhotoPreviews.querySelectorAll("button").forEach((button) => {
    button.disabled = true;
  });
  setMessage(museumNewsAdminFeedback, "Публикуем новость и фотографии…");
  let newsId = null;
  const uploadedPaths = [];
  const photosToPublish = [...selectedNewsPhotos];
  try {
    newsId = crypto.randomUUID();
    const { error: insertError } = await supabase
      .from("museum_news")
      .insert({
        id: newsId,
        body,
        moderator_user_id: moderatorUserId,
        status: "draft",
      });
    if (insertError) throw insertError;

    const photoRows = [];
    for (const [index, photo] of photosToPublish.entries()) {
      const extension = AVATAR_EXTENSIONS.get(photo.file.type);
      const path = `${newsId}/${crypto.randomUUID()}.${extension}`;
      const { error: uploadError } = await supabase.storage
        .from(MUSEUM_NEWS_BUCKET)
        .upload(path, photo.file, {
          cacheControl: "300",
          contentType: photo.file.type,
          upsert: false,
        });
      if (uploadError) throw uploadError;
      uploadedPaths.push(path);
      photoRows.push({
        news_id: newsId,
        storage_path: path,
        sort_order: index,
      });
    }

    if (photoRows.length) {
      const { error: photosError } = await supabase
        .from("museum_news_photos")
        .insert(photoRows);
      if (photosError) throw photosError;
    }

    const { error: publishError } = await supabase
      .from("museum_news")
      .update({
        status: "published",
        published_at: new Date().toISOString(),
      })
      .eq("id", newsId)
      .select("id")
      .single();
    if (publishError) throw publishError;

    closeMuseumNewsComposer();
    setMessage(museumNewsAdminFeedback, "Новость опубликована.", false, true);
    await Promise.all([
      loadPublishedMuseumNews(),
      loadModeratorMuseumNews("published"),
    ]);
  } catch (error) {
    const cleanupFailures = [];
    if (uploadedPaths.length) {
      try {
        const { error: removeError } = await supabase.storage
          .from(MUSEUM_NEWS_BUCKET)
          .remove(uploadedPaths);
        if (removeError) cleanupFailures.push(removeError);
      } catch (removeError) {
        cleanupFailures.push(removeError);
      }
    }
    if (newsId) {
      try {
        const { error: deleteError } = await supabase
          .from("museum_news")
          .delete()
          .eq("id", newsId)
          .eq("status", "draft");
        if (deleteError) cleanupFailures.push(deleteError);
      } catch (deleteError) {
        cleanupFailures.push(deleteError);
      }
    }
    if (cleanupFailures.length) {
      console.error("Не удалось полностью очистить неудачную публикацию новости.", cleanupFailures);
      reportError(
        museumNewsAdminFeedback,
        "Публикация не удалась; не все временные данные удалось очистить. Проверьте панель модератора.",
        { error, cleanupFailures }
      );
    } else {
      reportError(museumNewsAdminFeedback, "Не удалось опубликовать новость.", error);
    }
  } finally {
    museumNewsPublishButton.disabled = false;
    museumNewsCancelButton.disabled = false;
    museumNewsBody.disabled = false;
    museumNewsPhotosInput.disabled = false;
    museumNewsPhotoPreviews.querySelectorAll("button").forEach((button) => {
      button.disabled = false;
    });
  }
}

function renderGuestbookPagination(pageCount) {
  guestbookPagination.hidden = pageCount <= 1;
  guestbookPageNumbers.replaceChildren();
  guestbookPreviousPage.disabled = publishedReviewPage <= 1;
  guestbookNextPage.disabled = publishedReviewPage >= pageCount;
  if (pageCount <= 1) return;

  const visiblePages = new Set([1, pageCount]);
  for (
    let page = Math.max(1, publishedReviewPage - 2);
    page <= Math.min(pageCount, publishedReviewPage + 2);
    page += 1
  ) {
    visiblePages.add(page);
  }

  let previousPage = 0;
  [...visiblePages].sort((a, b) => a - b).forEach((page) => {
    if (page - previousPage > 1) {
      const ellipsis = document.createElement("span");
      ellipsis.className = "guestbook-page-ellipsis";
      ellipsis.textContent = "…";
      guestbookPageNumbers.append(ellipsis);
    }

    const button = document.createElement("button");
    button.type = "button";
    button.className = "guestbook-page-button";
    button.textContent = String(page);
    button.setAttribute("aria-label", `Страница ${page}`);
    if (page === publishedReviewPage) {
      button.setAttribute("aria-current", "page");
      button.disabled = true;
    } else {
      button.addEventListener("click", () => loadPublishedReviews(page));
    }
    guestbookPageNumbers.append(button);
    previousPage = page;
  });
}

async function loadPublishedReviews(page = publishedReviewPage) {
  setMessage(guestbookLoadFeedback, "Загружаем отзывы…");
  publishedReviewPage = Math.max(1, Math.floor(page));
  try {
    const fetchPage = (pageNumber) => supabase
      .from("guestbook_reviews")
      .select("id, first_name, last_name, body, rating, avatar_emoji, avatar_color, avatar_image_path, avatar_image_status, moderator_reply, moderator_replied_at, moderator_user_id, is_featured, is_first_review, created_at", { count: "exact" })
      .eq("status", "approved")
      .order("is_featured", { ascending: false })
      .order("created_at", { ascending: false })
      .range(
        (pageNumber - 1) * PUBLISHED_REVIEWS_PER_PAGE,
        pageNumber * PUBLISHED_REVIEWS_PER_PAGE - 1
      );

    let result = await fetchPage(publishedReviewPage);

    if (result.error) {
      reportError(guestbookLoadFeedback, "Не удалось загрузить отзывы. Попробуйте позже.", result.error);
      return;
    }

    const pageCount = Math.max(1, Math.ceil((result.count || 0) / PUBLISHED_REVIEWS_PER_PAGE));
    if (publishedReviewPage > pageCount) {
      publishedReviewPage = pageCount;
      result = await fetchPage(publishedReviewPage);
      if (result.error) {
        reportError(guestbookLoadFeedback, "Не удалось загрузить отзывы. Попробуйте позже.", result.error);
        return;
      }
    }
    renderGuestbookPagination(pageCount);

    const data = result.data || [];
    let voteCounts = [];
    if (data.length) {
      const { data: counts, error: countsError } = await supabase
        .from("guestbook_review_vote_counts")
        .select("review_id, likes, dislikes")
        .in("review_id", data.map((review) => review.id));
      if (countsError) {
        reportError(guestbookLoadFeedback, "Не удалось загрузить реакции на отзывы.", countsError);
        return;
      }
      voteCounts = counts;
    }

    const countByReviewId = new Map(voteCounts.map((count) => [count.review_id, count]));
    const reviewsWithVotes = data.map((review) => {
      const counts = countByReviewId.get(review.id);
      return {
        ...review,
        likes: counts?.likes || 0,
        dislikes: counts?.dislikes || 0,
        myVote: getStoredVote(review.id),
      };
    });

    guestbookReviewList.replaceChildren();
    if (!data.length) {
      setMessage(guestbookLoadFeedback, "Пока нет опубликованных отзывов.");
      return;
    }

    const cards = await prepareReviewCards(reviewsWithVotes, false, guestbookLoadFeedback);
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
      .select("id, first_name, last_name, body, rating, avatar_emoji, avatar_color, avatar_image_path, avatar_image_status, moderator_reply, moderator_replied_at, moderator_user_id, is_featured, is_first_review, status, created_at")
      .neq("status", "approved")
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
      .select("id, reviewer_first_name, reviewer_last_name, review_body, rating, moderator_reply_snapshot, action, previous_value, new_value, moderator_email, created_at")
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
      review_featured: "Отзыв отмечен как самый ценный",
      review_unfeatured: "С отзыва снята отметка «Самый ценный отзыв»",
      avatar_approved: "Фото аватара одобрено",
      avatar_rejected: "Фото аватара отклонено",
      avatar_reset: "Статус фото аватара изменён",
      avatar_submitted: "Фото аватара отправлено на проверку",
      moderator_replied: "Модератор ответил на отзыв",
      moderator_reply_updated: "Ответ модератора изменён",
      moderator_reply_deleted: "Ответ модератора удалён",
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

      entry.append(title, time, actor, action, createRatingDisplay(event.rating), body);
      if (
        event.moderator_reply_snapshot
        && (event.action === "moderator_replied" || event.action.startsWith("moderator_reply_"))
      ) {
        const reply = document.createElement("p");
        reply.className = "guestbook-history-body";
        reply.textContent = `Ответ модератора: ${event.moderator_reply_snapshot}`;
        entry.append(reply);
      }
      guestbookHistoryList.append(entry);
    });

    setMessage(guestbookHistoryFeedback, "");
  } catch (error) {
    reportError(guestbookHistoryFeedback, "Не удалось загрузить историю модерации.", error);
  }
}

async function saveModeratorReply(id, textarea, button) {
  const reply = textarea.value.trim();
  if (reply.length > MAX_REVIEW_LENGTH) {
    setMessage(moderatorAdminFeedback, "Ответ не должен превышать 1200 символов.", true);
    return;
  }

  button.disabled = true;
  setMessage(moderatorAdminFeedback, "Сохраняем ответ…");
  try {
    const { error } = await supabase
      .from("guestbook_reviews")
      .update({
        moderator_reply: reply || null,
        moderator_replied_at: reply ? new Date().toISOString() : null,
        moderator_user_id: reply ? moderatorUserId : null,
      })
      .eq("id", id)
      .select("id")
      .single();
    if (error) throw error;

    await Promise.all([loadModerationReviews(), loadPublishedReviews(), loadModerationHistory()]);
    setMessage(moderatorAdminFeedback, reply ? "Ответ сохранён." : "Ответ удалён.");
  } catch (error) {
    reportError(moderatorAdminFeedback, "Не удалось сохранить ответ модератора.", error);
    button.disabled = false;
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

    if (status === "approved") publishedReviewPage = 1;
    await Promise.all([loadModerationReviews(), loadPublishedReviews(), loadModerationHistory()]);
  } catch (error) {
    reportError(moderatorAdminFeedback, "Не удалось изменить статус отзыва.", error);
  }
}

async function updateReviewFeatured(id, isFeatured) {
  setMessage(moderatorAdminFeedback, "Сохраняем статус отзыва…");
  try {
    const { error } = await supabase
      .from("guestbook_reviews")
      .update({ is_featured: isFeatured })
      .eq("id", id)
      .eq("status", "approved")
      .select("id")
      .single();

    if (error) throw error;
    await Promise.all([loadPublishedReviews(), loadModerationHistory()]);
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

function setAdminSection(section = "reviews") {
  guestbookAdminReviews.hidden = section !== "reviews";
  guestbookHistory.hidden = section !== "history";
  guestbookAdminProfile.hidden = section !== "profile";
  guestbookAdminNews.hidden = section !== "news";
  guestbookAdminNewsArchive.hidden = section !== "newsArchive";
}

function renderModeratorProfilePhoto(photoUrl = null) {
  moderatorProfilePhotoPreview.replaceChildren(
    makeAvatar("🛡️", "gold", "Фото профиля модератора", photoUrl)
  );
}

async function loadModeratorProfile() {
  setMessage(moderatorProfileFeedback, "Загружаем профиль…");
  try {
    const { data, error } = await supabase
      .from("guestbook_moderators")
      .select("profile_first_name, profile_last_name, profile_image_path")
      .eq("user_id", moderatorUserId)
      .single();
    if (error) throw error;

    let photoUrl = null;
    if (data.profile_image_path) {
      const { data: signedPhoto, error: photoError } = await supabase.storage
        .from(MODERATOR_PROFILE_BUCKET)
        .createSignedUrl(data.profile_image_path, 3600);
      if (photoError) throw photoError;
      photoUrl = signedPhoto.signedUrl;
    }

    moderatorProfile = { ...data, photoUrl };
    moderatorProfileFirstName.value = data.profile_first_name || "";
    moderatorProfileLastName.value = data.profile_last_name || "";
    renderModeratorProfilePhoto(photoUrl);
    setMessage(moderatorProfileFeedback, "");
  } catch (error) {
    reportError(moderatorProfileFeedback, "Не удалось загрузить профиль модератора.", error);
  }
}

async function saveModeratorProfile(event) {
  event.preventDefault();
  if (!moderatorProfileForm.reportValidity()) return;

  const firstName = moderatorProfileFirstName.value.trim();
  const lastName = moderatorProfileLastName.value.trim();
  if (firstName.length < 2 || lastName.length < 2) {
    setMessage(moderatorProfileFeedback, "Имя и фамилия должны содержать не менее двух символов.", true);
    return;
  }

  const saveButton = document.getElementById("moderatorProfileSave");
  saveButton.disabled = true;
  setMessage(moderatorProfileFeedback, "Сохраняем профиль…");
  let uploadedPath = null;
  const oldImagePath = moderatorProfile?.profile_image_path || null;
  let cleanupError = null;

  try {
    const update = {
      profile_first_name: firstName,
      profile_last_name: lastName,
    };
    const file = moderatorProfilePhoto.files[0];
    if (file) {
      const extension = AVATAR_EXTENSIONS.get(file.type);
      if (!extension || file.size > MAX_AVATAR_SIZE) {
        setMessage(
          moderatorProfileFeedback,
          extension ? "Размер фотографии не должен превышать 3 МБ." : "Выберите изображение JPG, PNG или WebP.",
          true
        );
        return;
      }

      uploadedPath = `profiles/${crypto.randomUUID()}.${extension}`;
      const { error: uploadError } = await supabase.storage
        .from(MODERATOR_PROFILE_BUCKET)
        .upload(uploadedPath, file, {
          cacheControl: "300",
          contentType: file.type,
          upsert: false,
        });
      if (uploadError) throw uploadError;
      update.profile_image_path = uploadedPath;
    }

    const { error } = await supabase
      .from("guestbook_moderators")
      .update(update)
      .eq("user_id", moderatorUserId)
      .select("user_id")
      .single();
    if (error) throw error;

    if (uploadedPath && oldImagePath) {
      const { error: removeError } = await supabase.storage
        .from(MODERATOR_PROFILE_BUCKET)
        .remove([oldImagePath]);
      cleanupError = removeError;
    }

    moderatorProfilePhoto.value = "";
    if (moderatorProfilePhotoPreviewUrl) URL.revokeObjectURL(moderatorProfilePhotoPreviewUrl);
    moderatorProfilePhotoPreviewUrl = null;
    await Promise.all([loadModeratorProfile(), loadPublishedReviews()]);

    if (cleanupError) {
      reportError(
        moderatorProfileFeedback,
        "Профиль сохранён, но прежнее фото не удалось удалить из хранилища.",
        cleanupError
      );
    } else {
      setMessage(moderatorProfileFeedback, "Профиль модератора сохранён.");
    }
  } catch (error) {
    if (uploadedPath) {
      try {
        const { error: removeError } = await supabase.storage
          .from(MODERATOR_PROFILE_BUCKET)
          .remove([uploadedPath]);
        if (removeError) console.error("Не удалось удалить фото после ошибки сохранения профиля.", removeError);
      } catch (removeError) {
        console.error("Не удалось удалить фото после ошибки сохранения профиля.", removeError);
      }
    }
    reportError(moderatorProfileFeedback, "Не удалось сохранить профиль модератора.", error);
  } finally {
    saveButton.disabled = false;
  }
}

function closeAdminMenu() {
  guestbookAdminMenu.hidden = true;
  moderatorMenuToggle.setAttribute("aria-expanded", "false");
  moderatorMenuToggle.setAttribute("aria-label", "Открыть меню модератора");
}

async function verifyModerator(session) {
  if (!session) {
    moderatorUserId = null;
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
      moderatorUserId = null;
      closeAdminMenu();
      setMessage(moderatorFeedback, "У этого аккаунта нет прав модератора.", true);
      return;
    }

    moderatorUserId = session.user.id;
    let lastSeenError = null;
    try {
      const { error } = await supabase.rpc("touch_guestbook_moderator_last_seen");
      lastSeenError = error;
    } catch (error) {
      lastSeenError = error;
    }
    guestbookLogin.hidden = true;
    guestbookAdmin.hidden = false;
    setAdminSection("reviews");
    closeAdminMenu();
    guestbookModerator.open = true;
    await Promise.all([
      loadModerationReviews(),
      loadModeratorProfile(),
      loadPublishedReviews(),
      loadPublishedMuseumNews(),
      loadModeratorMuseumNews("published"),
      loadModeratorMuseumNews("archived"),
    ]);
    if (lastSeenError) {
      reportError(moderatorFeedback, "Вход выполнен, но время последнего посещения не удалось обновить.", lastSeenError);
    } else {
      setMessage(moderatorFeedback, "");
    }
  } catch (error) {
    reportError(moderatorFeedback, "Не удалось проверить права модератора.", error);
  }
}

async function initializeGuestbook() {
  createAvatarChoices();
  createRatingChoices();

  const config = window.MUSEUM_GUESTBOOK_CONFIG;
  if (!config || !config.supabaseUrl || !config.publishableKey) {
    setMessage(guestbookLoadFeedback, "Книга отзывов пока не настроена.", true);
    guestbookSubmit.disabled = true;
    return;
  }

  const { createClient } = await import(SUPABASE_MODULE_URL);
  supabase = createClient(config.supabaseUrl, config.publishableKey);
  await Promise.all([loadPublishedReviews(), loadPublishedMuseumNews()]);

  guestbookPreviousPage.addEventListener("click", () => {
    if (publishedReviewPage > 1) loadPublishedReviews(publishedReviewPage - 1);
  });
  guestbookNextPage.addEventListener("click", () => loadPublishedReviews(publishedReviewPage + 1));
  guestbookAvatarFile.addEventListener("change", handleAvatarFileSelection);
  museumNewsPhotosInput.addEventListener("change", handleMuseumNewsPhotoSelection);
  museumNewsEditor.addEventListener("submit", publishMuseumNews);
  museumNewsCancelButton.addEventListener("click", closeMuseumNewsComposer);
  museumNewsAdminCreateButton.addEventListener("click", openMuseumNewsComposer);
  museumNewsPublicCreateButton.addEventListener("click", openMuseumNewsComposer);
  museumNewsLightboxClose.addEventListener("click", () => museumNewsLightbox.close());
  museumNewsLightboxPrev.addEventListener("click", () => moveMuseumNewsLightbox(-1));
  museumNewsLightboxNext.addEventListener("click", () => moveMuseumNewsLightbox(1));
  museumNewsLightbox.addEventListener("close", () => {
    museumNewsLightboxImage.removeAttribute("src");
    museumNewsGalleryPhotos = [];
  });
  museumNewsLightbox.addEventListener("click", (event) => {
    if (event.target === museumNewsLightbox) museumNewsLightbox.close();
  });
  museumNewsLightbox.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      moveMuseumNewsLightbox(event.key === "ArrowLeft" ? -1 : 1);
    }
  });
  moderatorProfilePhoto.addEventListener("change", () => {
    const file = moderatorProfilePhoto.files[0];
    if (!file) return;
    const extension = AVATAR_EXTENSIONS.get(file.type);
    if (!extension || file.size > MAX_AVATAR_SIZE) {
      moderatorProfilePhoto.value = "";
      setMessage(
        moderatorProfileFeedback,
        extension ? "Размер фотографии не должен превышать 3 МБ." : "Выберите изображение JPG, PNG или WebP.",
        true
      );
      return;
    }

    if (moderatorProfilePhotoPreviewUrl) URL.revokeObjectURL(moderatorProfilePhotoPreviewUrl);
    moderatorProfilePhotoPreviewUrl = URL.createObjectURL(file);
    renderModeratorProfilePhoto(moderatorProfilePhotoPreviewUrl);
    setMessage(moderatorProfileFeedback, "Новое фото будет опубликовано после сохранения профиля.");
  });
  moderatorProfileForm.addEventListener("submit", saveModeratorProfile);
  guestbookUseEmoji.addEventListener("click", () => {
    clearSelectedAvatarFile();
    setMessage(guestbookFeedback, "Выберите один из смайликов для аватара.");
  });

  guestbookForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!guestbookForm.reportValidity()) return;

    guestbookSubmit.disabled = true;
    guestbookForm.classList.add("is-submitting");
    setMessage(guestbookFeedback, "Отправляем отзыв на проверку…");
    const reviewId = crypto.randomUUID();
    try {
      const { error } = await supabase.from("guestbook_reviews").insert({
        id: reviewId,
        first_name: guestbookFirstName.value.trim(),
        last_name: guestbookLastName.value.trim(),
        body: guestbookReview.value.trim(),
        rating: selectedRating,
        avatar_emoji: selectedEmoji,
        avatar_color: selectedColor,
        avatar_image_path: null,
        avatar_image_status: "none",
        consent: guestbookConsent.checked,
      });

      if (error) {
        if (
          error.code === "23514"
          && error.message?.includes("guestbook_reviews_avatar_color_check")
        ) {
          reportError(
            guestbookFeedback,
            "База данных пока не принимает собственные цвета. Выполните новую SQL-миграцию в Supabase.",
            error
          );
          return;
        }
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
      setSelectedColor(AVATAR_COLORS[0]);
      selectedRating = 0;
      updateRatingChoices();
      guestbookAvatarOptions.querySelectorAll("button").forEach((button) => {
        button.setAttribute("aria-pressed", String(button.textContent === selectedEmoji));
      });
      if (avatarUploadError) {
        console.error("Отзыв сохранён, но фото аватара не загрузилось.", avatarUploadError);
        setMessage(
          guestbookFeedback,
          "Ваш отзыв отправлен на модерацию! Фото не загрузилось, но отзыв сохранён со смайликом.",
          false,
          true
        );
      } else {
        setMessage(
          guestbookFeedback,
          photoSaved
            ? "Ваш отзыв отправлен на модерацию! Фото также отправлено на проверку."
            : "Ваш отзыв отправлен на модерацию!",
          false,
          true
        );
      }
    } catch (error) {
      reportError(guestbookFeedback, "Не удалось отправить отзыв. Проверьте подключение.", error);
    } finally {
      guestbookSubmit.disabled = false;
      guestbookForm.classList.remove("is-submitting");
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
    setAdminSection("reviews");
    closeAdminMenu();
    loadModerationReviews();
  });

  document.getElementById("moderatorMenuHistory").addEventListener("click", () => {
    setAdminSection("history");
    closeAdminMenu();
    loadModerationHistory();
  });

  document.getElementById("moderatorMenuProfile").addEventListener("click", () => {
    setAdminSection("profile");
    closeAdminMenu();
    loadModeratorProfile();
  });

  document.getElementById("moderatorMenuNews").addEventListener("click", () => {
    setAdminSection("news");
    closeAdminMenu();
    loadModeratorMuseumNews("published");
  });

  document.getElementById("moderatorMenuNewsArchive").addEventListener("click", () => {
    setAdminSection("newsArchive");
    closeAdminMenu();
    loadModeratorMuseumNews("archived");
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
      moderatorUserId = null;
      setAdminSection("reviews");
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
      moderatorUserId = null;
      setAdminSection("reviews");
      closeAdminMenu();
      loadPublishedReviews();
      loadPublishedMuseumNews();
    } else if (event === "INITIAL_SESSION" && session) {
      window.setTimeout(() => verifyModerator(session), 0);
    }
  });
}

initializeGuestbook().catch((error) => {
  reportError(guestbookLoadFeedback, "Не удалось подключить книгу отзывов.", error);
  guestbookSubmit.disabled = true;
});
