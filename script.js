const IMAGE_DIR = "images/";
const TEXT_DIR = "Texts/";
const AUDIO_DIR = "Audio/";

const GALLERY = [
  { file: "school_photo.jpg", caption: "Завидовская школа" },
  { file: "museum_entrance.jpg", caption: "Вход в школьный музей" },
  { file: "triptych_1.jpg", caption: "Триптих 1" },
  { file: "triptych_2.jpg", caption: "Триптих 2" },
  { file: "triptych_3.jpg", caption: "Триптих 3" },
  { file: "triptych_4.jpg", caption: "Триптих 4" },
  { file: "panorama_of_the_museum.jpg", caption: "Панорама музея" },
  { file: "right_longitudinal_view_of_the_museum.jpg", caption: "Правый продольный вид музея" },
  { file: "left_longitudinal_view_of_the_museum.jpg", caption: "Левый продольный вид музея" },
  { file: "final_zone_of_the_museum.jpg", caption: "Финальная зона музея" },
  { file: "the_right_wing_of_the_museum’s_final_zone.jpg", caption: "Правое крыло финальной зоны музея" },
  { file: "Exhibition_of_Konakovo_Faience.jpg", caption: "Выставка конаковского фаянса" },
];

const EXHIBITS = {
  museum_entrance_left_soviet_soldier_photo: {
    image: "museum_entrance_left_soviet_soldier_photo.jpg",
    textFile: "museum_entrance_left_soviet_soldier_photo_info_about_image.txt",
    title: "Командир разведподразделения",
    fallback:
      "Автор неизвестен.\nФотография Командира разведподразделения - Степан Максимович Мотовилин, в ряды Красной армии он вступил в 1941 году и служил командиром отделения в составе 4-го особого разведывательного отряда разведотдела штаба Северного флота. Под руководством дважды Героя Советского Союза Виктора Леонова он стал одним из самых результативных бойцов подразделения, совершив более 50 опасных разведывательных выходов в глубокий тыл противника в условиях Заполярья, лично уничтожив до 40 фашистов и дважды получив ранения. Известный писатель Константин Симонов отмечал его выдающийся талант «охотника», поразительную выносливость и полное отсутствие карьерного честолюбия. За свои фронтовые подвиги отважный старшина был награжден орденами Красного Знамени, Красной Звезды, Отечественной войны II степени и медалью «За отвагу».",
  },
  triptych_1_left_photo: {
    image: "triptych_1_left_photo.jpg",
    textFile: "triptych_1_left_photo_info_about_image.txt",
    title: "Пусть солдаты поспят",
    fallback:
      "Г.Липскеров - \"Пусть солдаты поспят\"(ВСЕ В ПОРЯДКЕ, МАЛЫШ?), 1941 - 1945 гг.\n\nНа черно-белой фотографии в рамке запечатлены спящие вплотную друг к другу советские солдаты, укутанные в шинели, а среди них прижался небольшой пятнистый беспородный щенок (дворняжка).",
  },
  triptych_1_central_photo: {
    image: "triptych_1_central_photo.jpg",
    textFile: "triptych_1_central_photo_info_about_image.txt",
    title: "Убитый немецкий солдат",
    fallback:
      "Ф.И.Семянников - \"Убитый немецкий солдат\", февраль 1945 года.\n\nНа исторической фотографии в рамке запечатлён погибший в бою немецкий солдат, лежащий на заснеженной земле возле пулемёта MG 42 с пулемётной лентой и коробкой для патронов.",
  },
  triptych_1_right_photo: {
    image: "triptych_1_right_photo.jpg",
    textFile: "triptych_1_right_photo_info_about_image.txt",
    title: "Действующая армия",
    fallback:
      "В.Тарасевич - \"Действующая Армия\". Западный фронт, 1941 год\n\nНа этом снимке времён Великой Отечественной Войны запечатлена группа советских солдат в шинелях и ушанках на открытой зимней позиции с артиллерийскими орудиями, один из которых с винтовкой наперевес переходит возле орудия с деревянными спицевыми колёсами на фоне заснеженного поля.",
  },
  triptych_2_left_photo: {
    image: "triptych_2_left_photo.jpg",
    textFile: "triptych_2_left_photo_info_about_image.txt",
    title: "Солдаты купаются",
    fallback:
      "А.Егоров - \"Солдаты купаются\", 1941 - 1945 гг.\n\nНа фотографии запечатлена сцена фронтового отдыха советских солдат на берегу водоёма или реки в окружении зарослей травы и камышей под пасмурным небом. На переднем плане один из бойцов раздевается у воды, готовясь к купанию, а остальные солдаты располагаются на берегу: кто-то стоит в форме, а другие сидят на траве рядом с винтовками и отдыхают во время короткой передышки.",
  },
  triptych_2_central_photo: {
    image: "triptych_2_central_photo.jpg",
    textFile: "triptych_2_central_photo_info_about_image.txt",
    title: "Военная дорога",
    fallback:
      "Д.Бальтерманц - \"Военная дорога\", 1941 г.\n\nНа фотографии запечатлена суровая фронтовая дорога зимой 1941 года, покрытая первыми слякотными следами снега и грязи. На переднем плане на обочине дороги лежит погибший боец с оружием, а вдали по размытой заснеженной дороге движется гужевая повозка, запряженная парой лошадей, и идут одиночные фигуры солдат под пасмурным, холодным небом.",
  },
  triptych_2_right_photo: {
    image: "triptych_2_right_photo.jpg",
    textFile: "triptych_2_right_photo_info_about_image.txt",
    title: "Передача кораблей советскому флоту",
    fallback:
      "Р.Диамент - \"Передача кораблей советскому флоту\", Великобритания, 1944 г.\n\nНа фотографии запечатлено торжественное событие времён Великой Отечественной войны — церемония передачи кораблей Советскому флоту союзниками в Великобритании в 1944 году. На переднем плане выстроилась группа шотландских волынщиков в традиционной форме с национальными инструментами, а на заднем плане видны огромные орудийные стволы военного корабля и собравшаяся на палубе и пирсе многочисленная толпа людей.",
  },
  triptych_3_left_photo: {
    image: "triptych_3_left_photo.jpg",
    textFile: "triptych_3_left_photo_info_about_image.txt",
    title: "Солдатский труд",
    fallback:
      "И.Озерский - \"Солдатский труд\", 1941 - 1945 гг.\n\nНа чёрно-белой фотографии запечатлена сцена, где на переднем плане по размытой полевой дороге уверенно идёт советский танкист в шлемофоне и спецовке, держа в руках полевой инструмент, а следом за ним по открытой местности движется тяжёлый танк (ИС-2) с десантом из бойцов на броне на фоне пасмурного неба и дымки.",
  },
  triptych_3_central_photo: {
    image: "triptych_3_central_photo.jpg",
    textFile: "triptych_3_central_photo_info_about_image.txt",
    title: "Знамя Победы над Рейхстагом",
    fallback:
      "Е.Халдей - \"Знамя Победы над Рейхстагом\", Берлин, 9 мая 1945 г.\n\nНа этом снимке запечатлен легендарный момент водружения Знамени Победы над разрушенным зданием Рейхстага в Берлине в мае 1945 года. На фоне затянутого дымом и гарью неба и панорам разбомбленного города советский солдат держит развивающееся знамя с серпом, молотом и пятиконечной звездой, а рядом на разрушенных конструкциях стоят фигуры других бойцов.",
  },
  triptych_3_right_photo: {
    image: "triptych_3_right_photo.jpg",
    textFile: "triptych_3_right_photo_info_about_image.txt",
    title: "На знамя смирно!",
    fallback:
      "Ф.И.Семянников - \"На знамя смирно!\", Карпаты, УССР, 1944 г.\n\nНа данной фотографии запечатлено торжественное построение советских военнослужащих на открытой местности. Слева выстроился ровный ряд солдат и офицеров в военной форме с оружием, а перед строем знаменосец держит развернутое знамя. Справа вдоль шеренги проходят командиры в парадных кителях с орденами и медалями, один из офицеров отдает воинское приветствие (честь), а на заднем плане виднеется ровная полоса лиственных деревьев Карпат",
  },
  triptych_4_central_photo: {
    image: "triptych_4_central_photo.jpg",
    textFile: "triptych_4_central_photo_info_about_image.txt",
    title: "Возвращение солдата",
    fallback:
      "О.Кнорринг - \"Возвращение солдата\", 1945 г.\n\nНа этой фотографии запечатлена эмоциональная сцена возвращения советского солдата домой к семье. На переднем плане боец в гимнастёрке, сапогах и с вещмешком за плечами крепко обнимает свою жену в платке и светлой рубашке, а вокруг них собрались дети: один ребёнок обхватил солдата за ноги, другие стоят рядом и смотрят на встречу на фоне деревенского пейзажа с деревянным забором и постройками.",
  },
  triptych_4_right_photo: {
    image: "triptych_4_right_photo.jpg",
    textFile: "triptych_4_right_photo_info_about_image.txt",
    title: "У разрушенного фашистами дома",
    fallback:
      "Л.Доренский - \"У разрушенного фашистами дома\", 1941 - 1943 гг.\n\nНа этой фотографии запечатлена трагическая сцена времён Великой Отечественной войны: на переднем плане стоят местные жители — женщина в платке со скарбом за плечами и пожилой мужчина с палкой, с горечью смотрящие на пепелище. Вокруг них простираются руины разрушенного и сожженного дома: видны груды битого кирпича, обгоревшие обломки фундамента и поднимающийся вдалеке дым от тлеющих построек на фоне уцелевшего забора и деревенского пейзажа.",
  },
};

function makeExhibit(id, title, extras = {}) {
  const textFile = extras.textFile === null ? null : (extras.textFile || `${id}_info_about_image.txt`);
  return {
    id,
    title,
    image: extras.image || `${id}.jpg`,
    preserveImageFormat: Boolean(extras.preserveImageFormat),
    textFile,
    audioFile: extras.audioFile === null ? null : (extras.audioFile || audioFileForExhibit(id, textFile)),
    fallback: extras.fallback || "",
    innerMarkers: extras.innerMarkers || null,
  };
}

function audioFileForExhibit(key, textFile) {
  if (textFile === null) return null;
  const fileStem = (textFile || `${key}_info_about_image.txt`).replace(/\.txt$/i, "");
  return `audio_for_${fileStem}.mp3`;
}

Object.assign(EXHIBITS, {
  "Putin_Vladimir_Vladimirovich(1)": makeExhibit("Putin_Vladimir_Vladimirovich(1)", "Президент Российской Федерации"),
  "Flag_RF(2)": makeExhibit("Flag_RF(2)", "Государственный флаг России"),
  "Gerb_RF(3)": makeExhibit("Gerb_RF(3)", "Государственный герб России"),
  "Hymn_RF(4)": makeExhibit("Hymn_RF(4)", "Государственный гимн России"),
  "vitrina_tankov(10)": makeExhibit("vitrina_tankov(10)", "Витрина военной техники"),
  "medicinskaya_vitrina(11)": makeExhibit("medicinskaya_vitrina(11)", "Медицинская витрина"),
  "maket_boev(12)": makeExhibit("maket_boev(12)", "Макет уличных боёв"),
  "Bratskaya_mogila_v_derevne_Varaksino_(I)": makeExhibit(
    "Bratskaya_mogila_v_derevne_Varaksino_(I)",
    "Братская могила в деревне Вараксино"
  ),
  "Pamyatniy_znak_Bocharovu_N.P_(II)": makeExhibit(
    "Pamyatniy_znak_Bocharovu_N.P_(II)",
    "Памятный знак Бочарову Н. П.",
    {
      innerMarkers: [
        {
          id: "Pamyatniy_znak_Bocharovu_N.P_(II)_(XXXVI)",
          title: "Биография Н. П. Бочарова",
          left: "38%",
          top: "40%",
          width: "14%",
          height: "22%",
        },
      ],
    }
  ),
  "Pamyatniy_znak_Bocharovu_N.P_(II)_(XXXVI)": makeExhibit(
    "Pamyatniy_znak_Bocharovu_N.P_(II)_(XXXVI)",
    "Николай Павлович Бочаров"
  ),
  "Bratskaya_mogila_v_sele_Zavidovo_(III)": makeExhibit(
    "Bratskaya_mogila_v_sele_Zavidovo_(III)",
    "Братская могила в селе Завидово"
  ),
  "Bratskaya_mogila_v_derevne_Arkhangelskoye_(IV)": makeExhibit(
    "Bratskaya_mogila_v_derevne_Arkhangelskoye_(IV)",
    "Братская могила в деревне Архангельское"
  ),
  "Katyusha_(V)": makeExhibit("Katyusha_(V)", "Памятник «Катюша»", {
    fallback: "Памятник «Катюша»\nНа 116 км автомагистрали Москва Санкт–Петербург у поворота на дорогу к городу Конаково установлен монумент «Катюша» — легендарная ракетная установка. Памятник сооружен в 1965 году. На этом рубеже началось наступление войск Калининского фронта, где шли ожесточенные кровопролитные бои.\nВ ноябре 1941 года воинам 185-й стрелковой дивизии был дан приказ остановить врага у села Завидово. Четыре дня шли кровопролитные бои, в результате которых дорогу на Конаково удалось закрыть для противника, хотя село и было оставлено. А 5 декабря началось знаменитое контрнаступление. В память об этих боях на повороте с шоссе Москва – Санкт-Петербург на Конаково стоит памятник – гвардейский миномёт «Катюша».\nНаши войска отбивали многочисленные атаки противника, задерживая его продвижение к Москве.\nНа постаменте мемориальная доска с надписью: «Здесь шли бои. Здесь, пламенем объятый, стоял на смерть России верный сын. Отсюда начинался путь солдата, нелёгкий путь к Победе, на Берлин».",
  }),
  "Memorial_Vasilkovskomu_(VI)": makeExhibit("Memorial_Vasilkovskomu_(VI)", "Мемориал Васильковскому"),
  "Bessmertny_Polk(7)_(VII)": makeExhibit("Bessmertny_Polk(7)_(VII)", "Дети на Бессмертном полку", { textFile: null }),
  "Bessmertny_Polk(7)_(VIII)": makeExhibit("Bessmertny_Polk(7)_(VIII)", "Встреча с духовенством", { textFile: null }),
  "Bessmertny_Polk(7)_(IX)": makeExhibit("Bessmertny_Polk(7)_(IX)", "Митинг у памятника", { textFile: null }),
  "Bessmertny_Polk(7)_(X)": makeExhibit("Bessmertny_Polk(7)_(X)", "Панихида", { textFile: null }),
  "Bessmertny_Polk(7)_(XI)": makeExhibit("Bessmertny_Polk(7)_(XI)", "Возложение цветов", { textFile: null }),
  "Bessmertny_Polk(7)_(XII)": makeExhibit("Bessmertny_Polk(7)_(XII)", "Последний ветеран из Завидово", { textFile: null }),
  "Bessmertny_Polk(7)_(XIII)": makeExhibit("Bessmertny_Polk(7)_(XIII)", "Честь и память!", { textFile: null }),
  "Bessmertny_Polk(7)_(XIV)": makeExhibit("Bessmertny_Polk(7)_(XIV)", "Память поколений", { textFile: null }),
  "Bessmertny_Polk(7)_(XV)": makeExhibit("Bessmertny_Polk(7)_(XV)", "Шествие Бессмертного полка", { textFile: null }),
  "Novay_School_vitrina(8)_(XVI)": makeExhibit("Novay_School_vitrina(8)_(XVI)", "Газета «Заря»", {
    image: "Novay_School_vitrina(8).jpg",
    textFile: null,
    fallback: "Газета «Заря» из витрины «Новая школа».",
  }),
  "Novay_School_vitrina(8)_(XVII)": makeExhibit("Novay_School_vitrina(8)_(XVII)", "Поход по местам боевой славы", { audioFile: null }),
  "Novay_School_vitrina(8)_(XVIII)": makeExhibit("Novay_School_vitrina(8)_(XVIII)", "Экскурсия в Калинине", { audioFile: null }),
  "Novay_School_vitrina(8)_(XIX)": makeExhibit("Novay_School_vitrina(8)_(XIX)", "Завидовская школа, 1971 год", { audioFile: null }),
  "Novay_School_vitrina(8)_(XX)": makeExhibit("Novay_School_vitrina(8)_(XX)", "У братской могилы в Завидово", { audioFile: null }),
  "Novay_School_vitrina(8)_(XXI)": makeExhibit("Novay_School_vitrina(8)_(XXI)", "Редколлегия «Завидовских вестей»", { audioFile: null }),
  "Novay_School_vitrina(8)_(XXII)": makeExhibit("Novay_School_vitrina(8)_(XXII)", "Педагогический коллектив, 1973 год", { audioFile: null }),
  "Novay_School_vitrina(8)_(XXIII)": makeExhibit("Novay_School_vitrina(8)_(XXIII)", "Школьники на местах боевой славы", { audioFile: null }),
  "Novay_School_vitrina(8)_(XXIV)": makeExhibit("Novay_School_vitrina(8)_(XXIV)", "Встреча с ветераном", { textFile: null }),
  "vipuskniki_1941g(9)_(XXVII)": makeExhibit("vipuskniki_1941g(9)_(XXVII)", "Харькин Николай", { textFile: null }),
  "vipuskniki_1941g(9)_(XXVIII)": makeExhibit("vipuskniki_1941g(9)_(XXVIII)", "Кузнецов Константин", { textFile: null }),
  "vipuskniki_1941g(9)_(XXIX)": makeExhibit("vipuskniki_1941g(9)_(XXIX)", "Моисеев Олег", { textFile: null }),
  "vipuskniki_1941g(9)_(XXXI)": makeExhibit("vipuskniki_1941g(9)_(XXXI)", "Херсонский Владимир", { textFile: null }),
  "vipuskniki_1941g(9)_(XXXII)": makeExhibit("vipuskniki_1941g(9)_(XXXII)", "Задоров Сергей", { textFile: null }),
  "vipuskniki_1941g(9)_(XXXIII)": makeExhibit("vipuskniki_1941g(9)_(XXXIII)", "Савинков Николай", { textFile: null }),
  "vipuskniki_1941g(9)_(XXXIV)": makeExhibit("vipuskniki_1941g(9)_(XXXIV)", "Соколов Сергей", { textFile: null }),
  "vipuskniki_1941g(9)_(XXXV)": makeExhibit("vipuskniki_1941g(9)_(XXXV)", "Закунов Александр", { textFile: null }),
  "vitrina_pamyati(13)_(XXV)": makeExhibit("vitrina_pamyati(13)_(XXV)", "Бой в Берлине", {
    audioFile: "audio_vitrina_pamyati(13)_(XXV)_info_about_image.mp3",
  }),
  "vitrina_pamyati(13)_(XXVI)": makeExhibit("vitrina_pamyati(13)_(XXVI)", "Хлеб для партизан"),
});

[
  {
    numeral: "I",
    audioFile: "audio_for_Stend_about_Chechnya_Afghanistan_WWII(1)_(I).mp3",
  },
  {
    numeral: "II",
    audioFile: "audio_Stend_about_Chechnya_Afghanistan_WWII(1)_(II).mp3",
  },
  {
    numeral: "III",
    audioFile: "audio_for_Stend_about_Chechnya_Afghanistan_WWII(1)_(III).mp3",
  },
  {
    numeral: "IV",
    audioFile: "audio_for_Stend_about_Chechnya_Afghanistan_WWII(1)_(IV)).mp3",
  },
  {
    numeral: "V",
    audioFile: "audio_for_Stend_about_Chechnya_Afghanistan_WWII(1)_(V).mp3",
  },
  {
    numeral: "VI",
    image: "Stend_about_Chechnya_Afghanistan_WWII(1)_(VI).png",
    textFile: "Stend_about_Chechnya_Afghanistan_WWII(1)_(VI)_info_about_image.txt",
    audioFile: "audio_for_Stend_about_Chechnya_Afghanistan_WWII(1)_(VI)_info_about_image.mp3",
    title: "Герой - Денис Сергеевич Стребин",
  },
  { numeral: "VII" },
  { numeral: "VIII" },
  { numeral: "X", title: "Рисунок Пети Помозкова" },
].forEach(({ numeral, ...details }) => {
  const id = `Stend_about_Chechnya_Afghanistan_WWII(1)_(${numeral})`;
  EXHIBITS[id] = makeExhibit(id, details.title || `Раздел ${numeral}`, {
    image: details.image || `${id}.jpg`,
    preserveImageFormat: true,
    textFile: details.textFile || null,
    audioFile: details.audioFile || null,
  });
});

Object.entries(EXHIBITS).forEach(([key, exhibit]) => {
  if (typeof exhibit.audioFile === "undefined") {
    exhibit.audioFile = audioFileForExhibit(key, exhibit.textFile);
  }
});

const HOTSPOTS = {
  1: [
    { id: "museum_entrance_left_soviet_soldier_photo", left: "2.4%", top: "16.5%", width: "15.2%", height: "17.8%" },
  ],
  2: [
    { id: "triptych_1_left_photo", left: "5.6%", top: "25.8%", width: "21.2%", height: "22.6%" },
    { id: "triptych_1_central_photo", left: "30.8%", top: "24.4%", width: "23.4%", height: "24.8%" },
    { id: "triptych_1_right_photo", left: "57.6%", top: "25.6%", width: "25.6%", height: "23.8%" },
  ],
  3: [
    { id: "triptych_2_left_photo", left: "4.6%", top: "25.4%", width: "22.4%", height: "22.8%" },
    { id: "triptych_2_central_photo", left: "30.6%", top: "25.2%", width: "24.6%", height: "24.2%" },
    { id: "triptych_2_right_photo", left: "58.4%", top: "25.8%", width: "26.4%", height: "24.6%" },
  ],
  4: [
    { id: "triptych_3_left_photo", left: "4.8%", top: "27.6%", width: "22.2%", height: "22.8%" },
    { id: "triptych_3_central_photo", left: "30.4%", top: "26.4%", width: "24.8%", height: "25.2%" },
    { id: "triptych_3_right_photo", left: "58.6%", top: "26.8%", width: "26.2%", height: "24.8%" },
  ],
  5: [
    { id: "triptych_4_central_photo", left: "26.4%", top: "23.6%", width: "22.8%", height: "33.4%" },
    { id: "triptych_4_right_photo", left: "55.8%", top: "26.8%", width: "26.6%", height: "24.6%" },
  ],
};

const MAP_OBJECTS = [
  { id: "Putin_Vladimir_Vladimirovich(1)", title: "Президент Российской Федерации", color: "gold", left: "91.5%", top: "4.2%", type: "exhibit" },
  { id: "Flag_RF(2)", title: "Государственный флаг России", color: "gold", left: "88.8%", top: "9.8%", type: "exhibit" },
  { id: "Gerb_RF(3)", title: "Государственный герб России", color: "gold", left: "93.1%", top: "15.6%", type: "exhibit" },
  { id: "Hymn_RF(4)", title: "Государственный гимн России", color: "gold", left: "88.8%", top: "19.6%", type: "exhibit" },
  { id: "kniga_pamyati(5)", title: "Книга памяти 1941–1945", color: "gold", left: "85.6%", top: "32.2%", type: "book" },
  { id: "bratskiye_zakhoroneniya(6)", title: "Стенд «Братские захоронения»", color: "red", left: "73.2%", top: "11.4%", type: "scene" },
  { id: "Bessmertny_Polk(7)", title: "Стенд «Бессмертный полк»", color: "red", left: "49.8%", top: "12.2%", type: "scene" },
  { id: "Novay_School_vitrina(8)", title: "Витрина «Новая школа»", color: "red", left: "28.6%", top: "12.0%", type: "scene" },
  { id: "vipuskniki_1941g(9)", title: "Выпускники 1941 года", color: "red", left: "15%", top: "30%", type: "scene" },
  { id: "vitrina_tankov(10)", title: "Витрина военной техники", color: "green", left: "19.6%", top: "38.4%", type: "exhibit" },
  { id: "medicinskaya_vitrina(11)", title: "Медицинская витрина", color: "green", left: "9.8%", top: "68.5%", type: "exhibit" },
  { id: "maket_boev(12)", title: "Макет уличных боёв", color: "blue", left: "47.6%", top: "30.8%", type: "exhibit" },
  { id: "vitrina_pamyati(13)", title: "Витрина памяти", color: "green", left: "67.4%", top: "31.0%", type: "scene" },
];

const LONGITUDINAL_OBJECTS = [
  {
    id: "Stend_about_Chechnya_Afghanistan_WWII(1)",
    title: "Экспозиция о Чечне, Афганистане и Великой Отечественной войне",
    number: "1",
    color: "red",
    left: "58%",
    top: "14%",
  },
  {
    title: "Стенд «История Завидово» — раздел готовится",
    number: "2",
    color: "red",
    left: "23%",
    top: "80%",
    disabled: true,
    labelPosition: "above",
  },
  {
    title: "Раздел готовится",
    number: "3",
    color: "blue",
    left: "61%",
    top: "94%",
    disabled: true,
    labelPosition: "above",
  },
];

const SCENES = {
  "bratskiye_zakhoroneniya(6)": {
    image: "bratskiye_zakhoroneniya(6).jpg",
    title: "Стенд «Братские захоронения»",
    spots: [
      { id: "Bratskaya_mogila_v_derevne_Varaksino_(I)", title: "Братская могила в деревне Вараксино", left: "22%", top: "22%", width: "24%", height: "18%" },
      { id: "Pamyatniy_znak_Bocharovu_N.P_(II)", title: "Памятный знак Бочарову Н. П.", left: "51%", top: "22%", width: "24%", height: "18%" },
      { id: "Bratskaya_mogila_v_sele_Zavidovo_(III)", title: "Братская могила в селе Завидово", left: "22%", top: "43%", width: "24%", height: "18%" },
      { id: "Bratskaya_mogila_v_derevne_Arkhangelskoye_(IV)", title: "Братская могила в деревне Архангельское", left: "51%", top: "43%", width: "24%", height: "18%" },
      { id: "Katyusha_(V)", title: "Памятник «Катюша»", left: "22%", top: "64%", width: "24%", height: "18%" },
      { id: "Memorial_Vasilkovskomu_(VI)", title: "Мемориал Васильковскому", left: "51%", top: "64%", width: "24%", height: "18%" },
    ],
  },
  "Bessmertny_Polk(7)": {
    image: "Bessmertny_Polk(7).jpg",
    title: "Стенд «Бессмертный полк»",
    spots: [
      { id: "Bessmertny_Polk(7)_(VII)", title: "Дети на Бессмертном полку", left: "8%", top: "7%", width: "22%", height: "28%" },
      { id: "Bessmertny_Polk(7)_(X)", title: "Панихида", left: "37%", top: "14%", width: "22%", height: "20%" },
      { id: "Bessmertny_Polk(7)_(XIII)", title: "Честь и память", left: "64%", top: "7%", width: "22%", height: "26%" },
      { id: "Bessmertny_Polk(7)_(VIII)", title: "Встреча с духовенством", left: "8%", top: "38%", width: "24%", height: "22%" },
      { id: "Bessmertny_Polk(7)_(XI)", title: "Возложение цветов", left: "37%", top: "38%", width: "24%", height: "22%" },
      { id: "Bessmertny_Polk(7)_(XIV)", title: "Память поколений", left: "66%", top: "38%", width: "24%", height: "22%" },
      { id: "Bessmertny_Polk(7)_(IX)", title: "Митинг у памятника", left: "8%", top: "64%", width: "24%", height: "22%" },
      { id: "Bessmertny_Polk(7)_(XII)", title: "Последний ветеран из Завидово", left: "39%", top: "62%", width: "20%", height: "22%" },
      { id: "Bessmertny_Polk(7)_(XV)", title: "Шествие Бессмертного полка", left: "64%", top: "64%", width: "26%", height: "22%" },
    ],
  },
  "Novay_School_vitrina(8)": {
    image: "Novay_School_vitrina(8).jpg",
    title: "Витрина «Новая школа»",
    spots: [
      { id: "Novay_School_vitrina(8)_(XVI)", title: "Газета «Заря»", left: "12%", top: "18%", width: "22%", height: "22%", disabled: true },
      { id: "Novay_School_vitrina(8)_(XVII)", title: "Поход по местам боевой славы", left: "12%", top: "42%", width: "20%", height: "18%" },
      { id: "Novay_School_vitrina(8)_(XVIII)", title: "Экскурсия в Калинине", left: "12%", top: "62%", width: "20%", height: "18%" },
      { id: "Novay_School_vitrina(8)_(XIX)", title: "Завидовская школа, 1971 год", left: "38%", top: "22%", width: "24%", height: "16%" },
      { id: "Novay_School_vitrina(8)_(XX)", title: "У братской могилы в Завидово", left: "38%", top: "42%", width: "24%", height: "16%" },
      { id: "Novay_School_vitrina(8)_(XXI)", title: "Редколлегия «Завидовских вестей»", left: "38%", top: "62%", width: "24%", height: "16%" },
      { id: "Novay_School_vitrina(8)_(XXII)", title: "Педагогический коллектив, 1973 год", left: "66%", top: "22%", width: "22%", height: "16%" },
      { id: "Novay_School_vitrina(8)_(XXIII)", title: "Школьники на местах боевой славы", left: "66%", top: "42%", width: "22%", height: "16%" },
      { id: "Novay_School_vitrina(8)_(XXIV)", title: "Встреча с ветераном", left: "66%", top: "62%", width: "22%", height: "16%" },
    ],
  },
  "vipuskniki_1941g(9)": {
    image: "vipuskniki_1941g(9).jpg",
    title: "Выпускники 1941 года",
    spots: [
      { id: "vipuskniki_1941g(9)_(XXVII)", title: "Харькин Николай", left: "20%", top: "28%", width: "13%", height: "22%" },
      { id: "vipuskniki_1941g(9)_(XXIX)", title: "Моисеев Олег", left: "36%", top: "28%", width: "13%", height: "22%" },
      { id: "vipuskniki_1941g(9)_(XXXII)", title: "Задоров Сергей", left: "52%", top: "28%", width: "13%", height: "22%" },
      { id: "vipuskniki_1941g(9)_(XXXIV)", title: "Соколов Сергей", left: "68%", top: "28%", width: "13%", height: "22%" },
      { id: "vipuskniki_1941g(9)_(XXVIII)", title: "Кузнецов Константин", left: "20%", top: "54%", width: "13%", height: "24%" },
      { id: "vipuskniki_1941g(9)_(XXXI)", title: "Херсонский Владимир", left: "36%", top: "54%", width: "13%", height: "24%" },
      { id: "vipuskniki_1941g(9)_(XXXIII)", title: "Савинков Николай", left: "52%", top: "54%", width: "13%", height: "24%" },
      { id: "vipuskniki_1941g(9)_(XXXV)", title: "Закунов Александр", left: "68%", top: "54%", width: "13%", height: "24%" },
    ],
  },
  "maket_boev(12)": {
    image: "maket_boev(12).jpg",
    title: "Макет уличных боёв",
    spots: [],
    exhibitId: "maket_boev(12)",
  },
  "vitrina_pamyati(13)": {
    image: "vitrina_pamyati(13).jpg",
    title: "Витрина памяти",
    spots: [
      { id: "vitrina_pamyati(13)_(XXV)", title: "Бой в Берлине", left: "18%", top: "12%", width: "22%", height: "16%" },
      { id: "vitrina_pamyati(13)_(XXVI)", title: "Хлеб для партизан", left: "18%", top: "28%", width: "22%", height: "16%" },
    ],
  },
  "Stend_about_Chechnya_Afghanistan_WWII(1)": {
    image: "Stend_about_Chechnya_Afghanistan_WWII(1).jpg",
    title: "Экспозиция о Чечне, Афганистане и Великой Отечественной войне",
    preserveImageFormat: true,
    spots: [
      { id: "Stend_about_Chechnya_Afghanistan_WWII(1)_(I)", title: "Раздел I", left: "31%", top: "23%", width: "22%", height: "15%" },
      { id: "Stend_about_Chechnya_Afghanistan_WWII(1)_(II)", title: "Раздел II", left: "55%", top: "29%", width: "16%", height: "9%" },
      { id: "Stend_about_Chechnya_Afghanistan_WWII(1)_(III)", title: "Раздел III", left: "55%", top: "20%", width: "17%", height: "9%" },
      { id: "Stend_about_Chechnya_Afghanistan_WWII(1)_(IV)", title: "Раздел IV", left: "30%", top: "40%", width: "23%", height: "16%" },
      { id: "Stend_about_Chechnya_Afghanistan_WWII(1)_(V)", title: "Раздел V", left: "59%", top: "42%", width: "17%", height: "15%" },
      { id: "Stend_about_Chechnya_Afghanistan_WWII(1)_(VI)", title: "Герой - Денис Сергеевич Стребин", left: "44%", top: "43%", width: "15%", height: "15%" },
      { id: "Stend_about_Chechnya_Afghanistan_WWII(1)_(VII)", title: "Раздел VII", left: "24%", top: "54%", width: "27%", height: "11%" },
      { id: "Stend_about_Chechnya_Afghanistan_WWII(1)_(VIII)", title: "Раздел VIII", left: "54%", top: "54%", width: "23%", height: "10%" },
      {
        id: "Stend_about_Chechnya_Afghanistan_WWII(1)_(IX)",
        title: "Я знаю и горжусь",
        left: "53%",
        top: "64%",
        width: "23%",
        height: "17%",
        labelPosition: "above",
        book: {
          title: "Я знаю и горжусь",
          pages: [
            { file: "Stend_about_Chechnya_Afghanistan_WWII(1)_(IX).jpg", label: "Обложка" },
            ...Array.from({ length: 12 }, (_, i) => ({
              file: `Stend_about_Chechnya_Afghanistan_WWII(1)_(IX)_page_${i + 1}.${i === 11 ? "png" : "jpg"}`,
              label: `Страница ${i + 1} из 12`,
            })),
          ],
        },
      },
      { id: "Stend_about_Chechnya_Afghanistan_WWII(1)_(X)", title: "Рисунок Пети Помозкова", left: "39%", top: "72%", width: "20%", height: "17%" },
    ],
  },
};

const MEMORY_BOOK_PAGES = Array.from({ length: 14 }, (_, i) => ({
    file: `kniga_pamyati(5)_page_${i + 1}.jpg`,
    label: `Страница ${i + 1} из 14`,
}));

const ABOUT_FALLBACK = `Завидовская средняя общеобразовательная школа была основана в 1971 году. История нашего села и школы неразрывно связаны: именно появление учебного заведения придало мощный импульс развитию территории, сделав её многолюдной и процветающей. Родители учеников искренне стремились к тому, чтобы их дети получали качественное образование прямо на родной земле, избавляя семьи от необходимости уезжать в другие города и позволяя совместными усилиями развивать родное поселение.
В истоках музея заложена инициатива Гореликова Валерия Петровича, возглавившего патриотический школьный кружок специализирующегося на раскопках и захоронениях останков советских бойцов. Находки от раскопок нужно было организовать в единое место, так и появился наш музей в 2009-м году. На этапе своего становления музей активно участвовал в профильных конкурсах и завоевал почетное первое место. Особо масштабный виток развития Завидовского музея пришелся на 2024–2026 годы.
Сегодня фонды музея хранят богатейшую коллекцию материалов, посвященных:
многовековой русской культуре;
ратной и трудовой истории местного поселения;
уникальным традициям и быту местного населения.
Этот музей — живая память поколений, объединяющая прошлое, настоящее и будущее нашей страны и школы.`;

const track = document.getElementById("track");
const dotsWrap = document.getElementById("dots");
const carousel = document.getElementById("carousel");
const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxCaption = document.getElementById("lightboxCaption");
const exhibit = document.getElementById("exhibit");
const exhibitPhoto = document.getElementById("exhibitPhoto");
const exhibitText = document.getElementById("exhibitText");
const exhibitTitle = document.getElementById("exhibitTitle");
const exhibitBlur = document.getElementById("exhibitBlur");
const exhibitMarkers = document.getElementById("exhibitMarkers");
const exhibitAudio = document.getElementById("exhibitAudio");
const audioToggle = document.getElementById("audioToggle");
const audioToggleLabel = document.getElementById("audioToggleLabel");
const audioStatus = document.getElementById("audioStatus");
const tour = document.getElementById("tour");
const tourViewport = document.getElementById("tourViewport");
const tourWorld = document.getElementById("tourWorld");
const mapFrame = document.getElementById("mapFrame");
const mapImage = document.getElementById("mapImage");
const mapMarkers = document.getElementById("mapMarkers");
const tourContinue = document.getElementById("tourContinue");
const tourBack = document.getElementById("tourBack");
const tourHint = document.getElementById("tourHint");
const scene = document.getElementById("scene");
const sceneViewport = document.getElementById("sceneViewport");
const sceneWorld = document.getElementById("sceneWorld");
const sceneFrame = document.getElementById("sceneFrame");
const scenePhoto = document.getElementById("scenePhoto");
const sceneMarkers = document.getElementById("sceneMarkers");
const bookView = document.getElementById("bookView");
const bookViewport = document.getElementById("bookViewport");
const bookWorld = document.getElementById("bookWorld");
const book3d = document.getElementById("book3d");
const bookLeaf = document.getElementById("bookLeaf");
const bookFrontImg = document.getElementById("bookFrontImg");
const bookBackImg = document.getElementById("bookBackImg");
const bookUnderImg = document.getElementById("bookUnderImg");
const bookPageLabel = document.getElementById("bookPageLabel");
const bookTitle = document.querySelector(".book-title");

const DEFAULT_LINKS = {
  max: "https://max.ru/id6911016133_gos",
  vk: "https://vk.ru/club181865686",
};

let index = 0;
let mapTransitionId = 0;
let lightboxGalleryMode = true;
let galleryRequestId = 0;
const galleryImageLoads = new Map();
let startX = 0;
let startY = 0;
const textCache = {};
let lightboxCloseTimer = 0;
let lightboxRequestId = 0;
let lightboxTargetIndex = 0;
let exhibitCloseTimer = 0;
let tourCloseTimer = 0;
let sceneCloseTimer = 0;
let sceneRequestId = 0;
let bookCloseTimer = 0;
let bookFlipTimer = 0;
let bookFlipHandler = null;
let bookPage = 0;
let bookBusy = false;
let currentBookPages = MEMORY_BOOK_PAGES;
let currentSceneBlur = "";
let currentExhibitId = null;
let exhibitStack = [];
let exhibitRequestId = 0;

if (window.matchMedia("(hover: none)").matches) {
  document.body.classList.add("touch-device");
}

function encodePath(dir, file, preserveImageFormat = false) {
  const imageFile = dir === IMAGE_DIR && !preserveImageFormat && !/^kniga_pamyati/i.test(file)
    ? file.replace(/\.(jpe?g)$/i, ".webp")
    : file;
  return dir + encodeURIComponent(imageFile).replace(/%2F/g, "/");
}

function createPanZoom(viewport, world) {
  const state = { scale: 1, x: 0, y: 0, min: 1, max: 4.2 };
  let dragging = false;
  let lastX = 0;
  let lastY = 0;
  let pointers = new Map();
  let pinchStart = 0;
  let pinchScale = 1;

  function constrain() {
    const width = world.offsetWidth * state.scale;
    const height = world.offsetHeight * state.scale;
    state.x = width <= viewport.clientWidth
      ? (viewport.clientWidth - width) / 2
      : Math.min(0, Math.max(viewport.clientWidth - width, state.x));
    state.y = height <= viewport.clientHeight
      ? (viewport.clientHeight - height) / 2
      : Math.min(0, Math.max(viewport.clientHeight - height, state.y));
  }

  function apply() {
    constrain();
    world.style.transform = `translate(${state.x}px, ${state.y}px) scale(${state.scale})`;
  }

  function zoomAt(mx, my, nextScale) {
    const prev = state.scale;
    const next = Math.min(state.max, Math.max(state.min, nextScale));
    const ratio = next / prev;
    state.x = mx - (mx - state.x) * ratio;
    state.y = my - (my - state.y) * ratio;
    state.scale = next;
    apply();
  }

  viewport.addEventListener("wheel", (event) => {
    event.preventDefault();
    const rect = viewport.getBoundingClientRect();
    zoomAt(event.clientX - rect.left, event.clientY - rect.top, state.scale * (event.deltaY < 0 ? 1.12 : 1 / 1.12));
  }, { passive: false });

  viewport.addEventListener("pointerdown", (event) => {
    if (event.target.closest("button")) return;
    pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
    if (viewport.setPointerCapture) viewport.setPointerCapture(event.pointerId);
    if (pointers.size === 1) {
      dragging = true;
      lastX = event.clientX;
      lastY = event.clientY;
      viewport.classList.add("is-panning");
    } else if (pointers.size === 2) {
      dragging = false;
      const pts = [...pointers.values()];
      pinchStart = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
      pinchScale = state.scale;
    }
  });

  viewport.addEventListener("pointermove", (event) => {
    if (!pointers.has(event.pointerId)) return;
    pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
    if (pointers.size === 2) {
      const pts = [...pointers.values()];
      const dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
      const rect = viewport.getBoundingClientRect();
      const mx = (pts[0].x + pts[1].x) / 2 - rect.left;
      const my = (pts[0].y + pts[1].y) / 2 - rect.top;
      zoomAt(mx, my, pinchScale * (dist / Math.max(pinchStart, 1)));
      return;
    }
    if (!dragging) return;
    state.x += event.clientX - lastX;
    state.y += event.clientY - lastY;
    lastX = event.clientX;
    lastY = event.clientY;
    apply();
  });

  function endPointer(event) {
    if (!pointers.has(event.pointerId)) return;
    pointers.delete(event.pointerId);
    if (pointers.size === 1) {
      const remainingPointer = [...pointers.values()][0];
      dragging = true;
      lastX = remainingPointer.x;
      lastY = remainingPointer.y;
    } else if (pointers.size === 0) {
      dragging = false;
      viewport.classList.remove("is-panning");
    }
  }

  viewport.addEventListener("pointerup", endPointer);
  viewport.addEventListener("pointercancel", endPointer);
  viewport.addEventListener("lostpointercapture", endPointer);

  return {
    state,
    apply,
    zoomAt,
    setPosition(x, y, scale = 1) {
      state.x = x;
      state.y = y;
      state.scale = scale;
      apply();
    },
  };
}

const mapZoom = createPanZoom(tourViewport, tourWorld);
const sceneZoom = createPanZoom(sceneViewport, sceneWorld);
const bookZoom = createPanZoom(bookViewport, bookWorld);

function fitImageFrame(viewport, frame, img, zoomApi, padding = 0.96) {
  const vw = viewport.clientWidth;
  const vh = viewport.clientHeight;
  const nw = img.naturalWidth || 1600;
  const nh = img.naturalHeight || 1000;
  const size = Math.min(vw / nw, vh / nh) * padding;
  frame.style.width = `${nw * size}px`;
  frame.style.height = `${nh * size}px`;
  zoomApi.setPosition((vw - nw * size) / 2, (vh - nh * size) / 2, 1);
}

function fitBook() {
  const vw = bookViewport.clientWidth;
  const vh = bookViewport.clientHeight;
  const aspectRatio = bookFrontImg.naturalWidth && bookFrontImg.naturalHeight
    ? bookFrontImg.naturalWidth / bookFrontImg.naturalHeight
    : 896 / 1198;
  const height = Math.min(vh * 0.82, vw * 0.88 / aspectRatio, 980);
  const width = height * aspectRatio;
  book3d.style.width = `${width}px`;
  book3d.style.height = `${height}px`;
  bookZoom.setPosition((vw - width) / 2, (vh - height) / 2 + 18, 1);
}

function fitGalleryImage(visual, img) {
  if (!img.naturalWidth || !img.naturalHeight) return;
  const shell = carousel.parentElement;
  const shellStyle = getComputedStyle(shell);
  const maxWidth = Math.min(
    shell.clientWidth - parseFloat(shellStyle.paddingLeft) - parseFloat(shellStyle.paddingRight),
    carousel.clientWidth
  ) * 0.96;
  const maxHeight = carousel.clientHeight * 0.94;
  if (!maxWidth || !maxHeight) return;
  const scale = Math.min(
    maxWidth / img.naturalWidth,
    maxHeight / img.naturalHeight
  );
  const width = img.naturalWidth * scale;
  const height = img.naturalHeight * scale;
  visual.style.width = `${width}px`;
  visual.style.height = `${height}px`;
}

function fitGalleryImages() {
  track.querySelectorAll(".slide-visual").forEach((visual) => {
    fitGalleryImage(visual, visual.querySelector(".slide-photo"));
  });
}

function renderGallery() {
  track.innerHTML = "";
  dotsWrap.innerHTML = "";

  GALLERY.forEach((item, i) => {
    const slide = document.createElement("article");
    slide.className = "slide";
    slide.dataset.index = String(i);

    const frame = document.createElement("div");
    frame.className = "slide-frame";

    const visual = document.createElement("div");
    visual.className = "slide-visual";

    const img = document.createElement("img");
    img.className = "slide-photo";
    img.loading = "lazy";
    img.decoding = "async";
    img.dataset.src = encodePath(IMAGE_DIR, item.file);
    img.alt = item.caption;
    img.addEventListener("load", () => fitGalleryImage(visual, img));
    img.addEventListener("error", () => {
      console.error(`Не удалось загрузить фотографию «${item.caption}».`);
    });
    visual.appendChild(img);

    (HOTSPOTS[i] || []).forEach((spot) => {
      const hotspot = document.createElement("button");
      hotspot.type = "button";
      hotspot.className = "hotspot has-visible-marker";
      hotspot.style.left = spot.left;
      hotspot.style.top = spot.top;
      hotspot.style.width = spot.width;
      hotspot.style.height = spot.height;
      hotspot.setAttribute("aria-label", `Открыть информацию: ${EXHIBITS[spot.id]?.title || item.caption}`);
      const marker = document.createElement("span");
      marker.className = "marker";
      marker.setAttribute("aria-hidden", "true");
      marker.innerHTML = '<span class="marker-icon">i</span>';
      hotspot.appendChild(marker);

      hotspot.addEventListener("click", (event) => {
        event.stopPropagation();
        openExhibit(spot.id, encodePath(IMAGE_DIR, item.file));
      });

      visual.appendChild(hotspot);
    });

    frame.appendChild(visual);
    slide.appendChild(frame);
    track.appendChild(slide);

    const dot = document.createElement("button");
    dot.className = "dot";
    dot.type = "button";
    dot.setAttribute("aria-label", `Фото ${i + 1}`);
    dot.addEventListener("click", () => goTo(i));
    dotsWrap.appendChild(dot);
  });

  goTo(0, true);
}

function isLightboxOpen() {
  return lightbox.classList.contains("is-open");
}

function isExhibitOpen() {
  return exhibit.classList.contains("is-open");
}

function isTourOpen() {
  return tour.classList.contains("is-open");
}

function isSceneOpen() {
  return scene.classList.contains("is-open");
}

function isBookOpen() {
  return bookView.classList.contains("is-open");
}

function loadGalleryImage(slide) {
  const image = slide.querySelector(".slide-photo");
  if (image.complete && image.naturalWidth) return Promise.resolve(true);

  const existingLoad = galleryImageLoads.get(image);
  if (existingLoad) return existingLoad;

  image.loading = "eager";
  image.fetchPriority = "high";
  image.src = image.dataset.src;
  const load = decodeImage(image, GALLERY[Number(slide.dataset.index)].caption)
    .finally(() => galleryImageLoads.delete(image));
  galleryImageLoads.set(image, load);
  return load;
}

function preloadNextGalleryImage(currentIndex) {
  const nextIndex = (currentIndex + 1) % GALLERY.length;
  const image = track.children[nextIndex].querySelector(".slide-photo");
  if (image.complete && image.naturalWidth) return;
  loadGalleryImage(track.children[nextIndex]);
}

async function goTo(nextIndex, instant) {
  const requestedIndex = (nextIndex + GALLERY.length) % GALLERY.length;
  const requestId = ++galleryRequestId;
  const imageReady = await loadGalleryImage(track.children[requestedIndex]);
  if (!imageReady || requestId !== galleryRequestId) return false;

  index = requestedIndex;
  fitGalleryImage(
    track.children[index].querySelector(".slide-visual"),
    track.children[index].querySelector(".slide-photo")
  );
  track.style.transition = instant ? "none" : "";
  track.style.transform = `translateX(-${index * 100}%)`;
  [...dotsWrap.children].forEach((dot, i) => dot.classList.toggle("active", i === index));
  [...track.children].forEach((slide, i) => {
    slide.classList.toggle("is-active", i === index);
    if (i === index) {
      slide.scrollTop = 0;
      fitGalleryImage(slide.querySelector(".slide-visual"), slide.querySelector(".slide-photo"));
    }
  });
  if (instant) requestAnimationFrame(() => {
    track.style.transition = "";
  });
  preloadNextGalleryImage(index);
  return true;
}

function openLightbox() {
  const item = GALLERY[index];
  lightboxTargetIndex = index;
  lightboxGalleryMode = true;
  const requestId = ++lightboxRequestId;
  clearTimeout(lightboxCloseTimer);
  lightbox.classList.remove("is-exhibit-image");
  lightbox.classList.remove("is-closing");
  lightbox.setAttribute("aria-hidden", "false");
  lightboxImage.classList.remove("is-shown");
  lightboxImage.src = encodePath(IMAGE_DIR, item.file);
  lightboxImage.alt = item.caption;
  lightboxCaption.textContent = item.caption;
  document.body.classList.add("modal-open");
  decodeImage(lightboxImage, item.file).then(() => {
    if (requestId !== lightboxRequestId) return;
    requestAnimationFrame(() => {
      if (requestId !== lightboxRequestId) return;
      lightbox.classList.add("is-open");
      requestAnimationFrame(() => {
        if (requestId === lightboxRequestId) lightboxImage.classList.add("is-shown");
      });
    });
  });
}

function openImageLightbox(src, caption) {
  const requestId = ++lightboxRequestId;
  lightboxGalleryMode = false;
  clearTimeout(lightboxCloseTimer);
  lightbox.classList.add("is-exhibit-image");
  lightbox.classList.remove("is-closing");
  lightbox.setAttribute("aria-hidden", "false");
  lightboxImage.classList.remove("is-shown");
  lightboxImage.src = src;
  lightboxImage.alt = caption;
  lightboxCaption.textContent = caption;
  document.body.classList.add("modal-open");
  decodeImage(lightboxImage, caption).then((imageReady) => {
    if (!imageReady || requestId !== lightboxRequestId) return;
    requestAnimationFrame(() => {
      if (requestId !== lightboxRequestId) return;
      lightbox.classList.add("is-open");
      requestAnimationFrame(() => {
        if (requestId === lightboxRequestId) lightboxImage.classList.add("is-shown");
      });
    });
  });
}

function navigateLightbox(direction) {
  if (!lightboxGalleryMode) return;
  lightboxTargetIndex = (lightboxTargetIndex + direction + GALLERY.length) % GALLERY.length;
  const requestedIndex = lightboxTargetIndex;
  goTo(requestedIndex).then((navigated) => {
    if (navigated && isLightboxOpen() && requestedIndex === lightboxTargetIndex) openLightbox();
  });
}

function closeLightbox() {
  lightboxRequestId += 1;
  lightbox.classList.remove("is-open");
  lightbox.classList.add("is-closing");
  lightboxImage.classList.remove("is-shown");
  lightbox.setAttribute("aria-hidden", "true");
  if (!isExhibitOpen() && !isTourOpen()) document.body.classList.remove("modal-open");
  lightboxCloseTimer = window.setTimeout(() => {
    lightbox.classList.remove("is-closing");
    lightbox.classList.remove("is-exhibit-image");
  }, 420);
}

async function decodeImage(image, description) {
  try {
    await image.decode();
    return true;
  } catch (error) {
    console.error(`Не удалось загрузить фотографию «${description}».`, error);
    return false;
  }
}

async function readTextFile(path, fallback) {
  if (textCache[path]) return textCache[path];
  try {
    const response = await fetch(path);
    if (!response.ok) throw new Error("fetch failed");
    const text = (await response.text()).trim();
    textCache[path] = text || fallback;
  } catch {
    textCache[path] = fallback;
  }
  return textCache[path];
}

function renderNestedMarkers(container, spots, blurSrc) {
  container.innerHTML = "";
  (spots || []).forEach((spot) => {
    const area = document.createElement("button");
    area.type = "button";
    area.className = `hot-area${spot.disabled ? " is-disabled" : ""}`;
    area.disabled = Boolean(spot.disabled);
    area.style.left = spot.left;
    area.style.top = spot.top;
    area.style.width = spot.width;
    area.style.height = spot.height;
    area.setAttribute("aria-label", `Открыть информацию: ${spot.title}`);

    const label = document.createElement("span");
    label.className = `hot-area-label${spot.labelPosition === "above" ? " is-above" : ""}`;
    label.textContent = spot.title;
    area.appendChild(label);

    if (!spot.disabled) {
      area.addEventListener("click", (event) => {
        event.stopPropagation();
        if (spot.book) {
          openBook(spot.book.pages, spot.book.title);
          return;
        }
        openExhibit(spot.id, blurSrc);
      });
    }
    container.appendChild(area);
  });
}

async function openExhibit(id, blurSrc) {
  const data = EXHIBITS[id];
  if (!data) return;
  const audioFile = typeof data.audioFile === "undefined"
    ? audioFileForExhibit(id, data.textFile)
    : data.audioFile;
  const requestId = ++exhibitRequestId;

  if (isExhibitOpen() && currentExhibitId && currentExhibitId !== id) {
    exhibitStack.push({ id: currentExhibitId, blur: exhibitBlur.style.backgroundImage });
  }
  currentExhibitId = id;
  const isHeroPortrait = id === "Stend_about_Chechnya_Afghanistan_WWII(1)_(VI)";
  exhibit.classList.toggle("is-symbol-detail", id === "Gerb_RF(3)" || id === "Hymn_RF(4)");
  exhibit.classList.toggle("is-hymn-detail", id === "Hymn_RF(4)");
  exhibit.classList.toggle("is-flag-detail", id === "Flag_RF(2)");
  exhibit.classList.toggle("is-biography-detail", isHeroPortrait);

  exhibit.classList.remove("is-open");
  exhibitPhoto.src = encodePath(IMAGE_DIR, data.image, data.preserveImageFormat);
  exhibitPhoto.alt = data.title || data.image;
  if (isHeroPortrait) {
    exhibitPhoto.setAttribute("role", "button");
    exhibitPhoto.setAttribute("tabindex", "0");
    exhibitPhoto.setAttribute("aria-label", `Открыть фотографию на весь экран: ${data.title}`);
  } else {
    exhibitPhoto.removeAttribute("role");
    exhibitPhoto.removeAttribute("tabindex");
    exhibitPhoto.removeAttribute("aria-label");
  }
  exhibitTitle.textContent = data.title || "";
  exhibitBlur.style.backgroundImage = `url("${blurSrc}")`;
  exhibitText.textContent = data.textFile ? "Загрузка описания..." : "";
  exhibitMarkers.innerHTML = "";
  clearTimeout(exhibitCloseTimer);
  exhibit.setAttribute("aria-hidden", "false");
  exhibit.classList.remove("is-closing");
  document.body.classList.add("modal-open");
  decodeImage(exhibitPhoto, data.image).then(() => {
    if (requestId !== exhibitRequestId) return;
    requestAnimationFrame(() => {
      if (requestId === exhibitRequestId) exhibit.classList.add("is-open");
    });
  });
  stopAudio();
  audioStatus.hidden = true;
  audioStatus.textContent = "Аудиодорожка недоступна.";
  audioToggle.hidden = !audioFile;
  audioToggle.disabled = false;

  if (data.innerMarkers) {
    renderNestedMarkers(
      exhibitMarkers,
      data.innerMarkers,
      encodePath(IMAGE_DIR, data.image, data.preserveImageFormat)
    );
  }

  if (audioFile) {
    exhibitAudio.hidden = false;
    exhibitAudio.src = encodePath(AUDIO_DIR, audioFile);
    exhibitAudio.load();
  } else {
    exhibitAudio.hidden = true;
    exhibitAudio.removeAttribute("src");
    exhibitAudio.load();
  }

  if (data.textFile) {
    const text = await readTextFile(encodePath(TEXT_DIR, data.textFile), data.fallback);
    if (requestId !== exhibitRequestId) return;
    exhibitText.textContent = text;
  } else {
    exhibitText.textContent = data.fallback || "";
  }
}

function closeExhibit() {
  const exhibitIsPending = exhibit.getAttribute("aria-hidden") === "false";
  if (!isExhibitOpen() && !exhibit.classList.contains("is-closing") && !exhibitIsPending) {
    exhibitStack = [];
    currentExhibitId = null;
    stopAudio();
    return;
  }
  const previous = exhibitStack.pop();
  if (previous) {
    stopAudio();
    openExhibit(previous.id, previous.blur.replace(/^url\(["']?/, "").replace(/["']?\)$/, ""));
    exhibitStack.pop();
    return;
  }
  exhibit.classList.remove("is-open");
  exhibit.classList.add("is-closing");
  exhibit.setAttribute("aria-hidden", "true");
  exhibitRequestId += 1;
  currentExhibitId = null;
  if (!isLightboxOpen() && !isTourOpen() && !isSceneOpen() && !isBookOpen()) {
    document.body.classList.remove("modal-open");
  }
  stopAudio();
  exhibitCloseTimer = window.setTimeout(() => {
    exhibit.classList.remove("is-closing");
  }, 420);
}

function stopAudio() {
  exhibitAudio.pause();
  if (Number.isFinite(exhibitAudio.duration)) exhibitAudio.currentTime = 0;
  updateAudioToggle();
}

function updateAudioToggle() {
  const isPlaying = !exhibitAudio.paused && !exhibitAudio.ended;
  audioToggle.classList.toggle("is-playing", isPlaying);
  audioToggle.setAttribute("aria-pressed", String(isPlaying));
  audioToggle.setAttribute("aria-label", isPlaying ? "Остановить аудиозапись" : "Слушать аудиозапись");
  audioToggleLabel.textContent = isPlaying ? "Остановить аудио" : "Слушать аудио";
}

function parseLinks(raw) {
  const links = { ...DEFAULT_LINKS };
  raw.split(/\r?\n/).forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed) return;
    const match = trimmed.match(/^(MAX|VK)\s*[:\-–]?\s*(https?:\/\/\S+)/i);
    if (match) {
      const key = match[1].toLowerCase();
      links[key] = match[2];
      return;
    }
    if (/max/i.test(trimmed) && /https?:\/\//i.test(trimmed)) {
      links.max = trimmed.match(/https?:\/\/\S+/i)[0];
    }
    if (/vk/i.test(trimmed) && /https?:\/\//i.test(trimmed)) {
      links.vk = trimmed.match(/https?:\/\/\S+/i)[0];
    }
  });
  return links;
}

async function loadAboutAndLinks() {
  const about = await readTextFile(
    encodePath(TEXT_DIR, "main_information_about_the_school_museum_below_the_images.txt"),
    ABOUT_FALLBACK
  );
  const aboutBox = document.getElementById("aboutText");
  aboutBox.innerHTML = "";
  about.replace(/\u200b/g, "").split(/\n+/).map((block) => block.trim()).filter(Boolean).forEach((block) => {
    const p = document.createElement("p");
    p.textContent = block;
    aboutBox.appendChild(p);
  });

  const linksRaw = await readTextFile(encodePath(TEXT_DIR, "links.txt"), "");
  const links = parseLinks(linksRaw);
  const maxLink = document.getElementById("maxLink");
  const vkLink = document.getElementById("vkLink");
  maxLink.href = links.max || DEFAULT_LINKS.max;
  vkLink.href = links.vk || DEFAULT_LINKS.vk;
  maxLink.setAttribute("target", "_blank");
  vkLink.setAttribute("target", "_blank");
}

function renderMapMarkers() {
  mapMarkers.innerHTML = "";
  MAP_OBJECTS.forEach((item, i) => {
    const pin = document.createElement("button");
    pin.type = "button";
    pin.className = `map-pin ${item.color}`;
    pin.style.left = item.left;
    pin.style.top = item.top;
    pin.style.animationDelay = `${0.12 * i}s`;
    pin.setAttribute("aria-label", item.title);
    pin.title = item.title;
    if (item.id === "vipuskniki_1941g(9)") pin.classList.add("is-graduates-marker");
    const horizontalPosition = Number.parseFloat(item.left);
    pin.dataset.labelPosition = horizontalPosition > 80 ? "left" : horizontalPosition < 18 ? "right" : "below";
    const glow = document.createElement("span");
    glow.className = "pin-glow";
    const dot = document.createElement("span");
    dot.className = "pin-dot";
    pin.append(glow, dot);

    const label = document.createElement("span");
    label.className = "pin-label";
    const title = document.createElement("span");
    title.className = "pin-label-text";
    title.textContent = item.title;
    label.appendChild(title);
    pin.appendChild(label);

    pin.addEventListener("click", (event) => {
      event.stopPropagation();
      openMapObject(item);
    });
    mapMarkers.appendChild(pin);
  });
}

function renderLongitudinalMarkers() {
  mapMarkers.innerHTML = "";
  LONGITUDINAL_OBJECTS.forEach((item) => {
    const pin = document.createElement("button");
    pin.type = "button";
    pin.className = `map-pin longitudinal-pin ${item.color}${item.disabled ? " is-disabled" : ""}`;
    pin.style.left = item.left;
    pin.style.top = item.top;
    pin.dataset.labelPosition = item.labelPosition || "below";
    pin.setAttribute("aria-label", item.title);
    pin.setAttribute("aria-disabled", String(Boolean(item.disabled)));
    pin.title = item.title;

    const glow = document.createElement("span");
    glow.className = "pin-glow";
    const dot = document.createElement("span");
    dot.className = "pin-dot";
    const label = document.createElement("span");
    label.className = "pin-label";
    const title = document.createElement("span");
    title.className = "pin-label-text";
    title.textContent = item.title;
    label.appendChild(title);
    pin.append(glow, dot, label);

    if (!item.disabled) {
      pin.addEventListener("click", (event) => {
        event.stopPropagation();
        openScene(item.id);
      });
    }
    mapMarkers.appendChild(pin);
  });
}

async function switchTourMap(image, alt, renderMarkers, showContinue, immediate) {
  const imagePath = encodePath(IMAGE_DIR, image);
  const transitionId = ++mapTransitionId;
  const updateView = () => {
    mapImage.alt = alt;
    renderMarkers();
    tourContinue.hidden = !showContinue;
    tourBack.hidden = showContinue;
    if (mapImage.getAttribute("src") !== imagePath) mapImage.src = imagePath;
  };

  if (immediate || !isTourOpen()) {
    mapFrame.classList.remove("is-transitioning");
    updateView();
    return;
  }

  if (mapImage.getAttribute("src") === imagePath) {
    updateView();
    return;
  }

  mapFrame.classList.add("is-transitioning");
  const fadeDuration = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 320;
  await new Promise((resolve) => window.setTimeout(resolve, fadeDuration));
  if (transitionId !== mapTransitionId) return;

  updateView();
  const imageReady = await decodeImage(mapImage, alt);
  if (transitionId !== mapTransitionId) return;
  if (imageReady && isTourOpen()) {
    fitImageFrame(tourViewport, mapFrame, mapImage, mapZoom);
  }
  requestAnimationFrame(() => {
    if (transitionId === mapTransitionId) mapFrame.classList.remove("is-transitioning");
  });
}

function showEntranceMap(immediate = false) {
  return switchTourMap(
    "interior_of_the_museum_entrance.png",
    "Интерактивная схема входа в школьный музей",
    renderMapMarkers,
    true,
    immediate
  );
}

function showLongitudinalMap() {
  return switchTourMap(
    "facing_two_longitudinal_(interactive).png",
    "Продольный вид экспозиции школьного музея",
    renderLongitudinalMarkers,
    false,
    false
  );
}

function openMapObject(item) {
  const blur = encodePath(IMAGE_DIR, "interior_of_the_museum_entrance.png");
  currentSceneBlur = blur;
  if (item.type === "book") {
    openBook();
    return;
  }
  if (item.type === "scene") {
    const sceneData = SCENES[item.id];
    if (sceneData && sceneData.exhibitId && !sceneData.spots.length) {
      openExhibit(sceneData.exhibitId, blur);
      return;
    }
    openScene(item.id);
    return;
  }
  openExhibit(item.id, blur);
}

function openTour() {
  showEntranceMap(true);
  clearTimeout(tourCloseTimer);
  tour.setAttribute("aria-hidden", "false");
  tour.classList.remove("is-closing");
  document.body.classList.add("modal-open");
  requestAnimationFrame(() => {
    tour.classList.add("is-open");
    if (mapImage.complete && mapImage.naturalWidth) {
      fitImageFrame(tourViewport, mapFrame, mapImage, mapZoom);
    }
  });
  tourHint.hidden = false;
  requestAnimationFrame(() => tourHint.classList.add("is-visible"));
}

function closeTour() {
  exhibitStack = [];
  closeExhibit();
  closeScene();
  closeBook();
  showEntranceMap(true);
  tour.classList.remove("is-open");
  tour.classList.add("is-closing");
  tour.setAttribute("aria-hidden", "true");
  showEntranceMap();
  tourHint.classList.remove("is-visible");
  document.body.classList.remove("modal-open");
  tourCloseTimer = window.setTimeout(() => tour.classList.remove("is-closing"), 700);
}

function openScene(id) {
  const data = SCENES[id];
  if (!data) return;
  const requestId = ++sceneRequestId;
  clearTimeout(sceneCloseTimer);
  scenePhoto.src = encodePath(IMAGE_DIR, data.image, data.preserveImageFormat);
  scenePhoto.alt = data.title;
  renderNestedMarkers(
    sceneMarkers,
    data.spots,
    encodePath(IMAGE_DIR, data.image, data.preserveImageFormat)
  );
  scene.setAttribute("aria-hidden", "false");
  scene.classList.remove("is-closing");
  decodeImage(scenePhoto, data.image).then(() => {
    if (requestId !== sceneRequestId) return;
    fitImageFrame(sceneViewport, sceneFrame, scenePhoto, sceneZoom, 0.94);
    requestAnimationFrame(() => {
      if (requestId === sceneRequestId) scene.classList.add("is-open");
    });
  });
}

function closeScene() {
  const sceneIsPending = scene.getAttribute("aria-hidden") === "false";
  if (!isSceneOpen() && !scene.classList.contains("is-closing") && !sceneIsPending) return;
  sceneRequestId += 1;
  scene.classList.remove("is-open");
  scene.classList.add("is-closing");
  scene.setAttribute("aria-hidden", "true");
  sceneCloseTimer = window.setTimeout(() => scene.classList.remove("is-closing"), 500);
}

function bookSrc(page) {
  return encodePath(IMAGE_DIR, currentBookPages[page].file, true);
}

function updateBookChrome() {
  bookPageLabel.textContent = currentBookPages[bookPage].label;
  document.getElementById("bookPrev").disabled = bookPage === 0 || bookBusy;
  document.getElementById("bookNext").disabled = bookPage === currentBookPages.length - 1 || bookBusy;
}

function openBook(pages = MEMORY_BOOK_PAGES, title = "Книга памяти 1941–1945") {
  clearTimeout(bookCloseTimer);
  clearTimeout(bookFlipTimer);
  if (bookFlipHandler) bookLeaf.removeEventListener("transitionend", bookFlipHandler);
  bookFlipHandler = null;
  bookFlipTimer = 0;
  currentBookPages = pages;
  bookTitle.textContent = title;
  bookPage = 0;
  bookBusy = false;
  bookLeaf.classList.remove("is-turning-forward", "is-turning-back", "is-flipping-forward", "is-flipping-back");
  bookZoom.setPosition(0, 0, 1);
  bookFrontImg.src = bookSrc(0);
  bookUnderImg.src = bookSrc(1);
  bookBackImg.src = bookSrc(1);
  updateBookChrome();
  bookView.setAttribute("aria-hidden", "false");
  bookView.classList.remove("is-closing");
  requestAnimationFrame(() => {
    bookView.classList.add("is-open");
    fitBook();
  });
}

function closeBook() {
  if (!isBookOpen() && !bookView.classList.contains("is-closing")) return;
  clearTimeout(bookFlipTimer);
  if (bookFlipHandler) bookLeaf.removeEventListener("transitionend", bookFlipHandler);
  bookFlipHandler = null;
  bookFlipTimer = 0;
  bookBusy = false;
  bookLeaf.classList.remove("is-turning-forward", "is-turning-back", "is-flipping-forward", "is-flipping-back");
  bookView.classList.remove("is-open");
  bookView.classList.add("is-closing");
  bookView.setAttribute("aria-hidden", "true");
  bookCloseTimer = window.setTimeout(() => bookView.classList.remove("is-closing"), 500);
}

function flipBook(direction) {
  if (bookBusy) return;
  const next = bookPage + direction;
  if (next < 0 || next >= currentBookPages.length) return;
  bookBusy = true;
  bookLeaf.classList.remove("is-flipping-forward", "is-flipping-back");
  bookLeaf.classList.add(direction > 0 ? "is-flipping-forward" : "is-flipping-back");
  updateBookChrome();

  if (direction > 0) {
    bookFrontImg.src = bookSrc(bookPage);
    bookBackImg.src = bookSrc(next);
    bookUnderImg.src = bookSrc(next);
    bookLeaf.style.transition = "none";
    bookLeaf.classList.remove("is-turning-forward", "is-turning-back");
    void bookLeaf.offsetWidth;
    bookLeaf.style.transition = "";
    requestAnimationFrame(() => bookLeaf.classList.add("is-turning-forward"));
  } else {
    bookFrontImg.src = bookSrc(next);
    bookBackImg.src = bookSrc(bookPage);
    bookUnderImg.src = bookSrc(bookPage);
    bookLeaf.style.transition = "none";
    bookLeaf.classList.remove("is-turning-forward", "is-turning-back");
    bookLeaf.classList.add("is-turning-back");
    void bookLeaf.offsetWidth;
    bookLeaf.style.transition = "";
    requestAnimationFrame(() => bookLeaf.classList.remove("is-turning-back"));
  }

  const finishFlip = (event) => {
    if (event && (event.target !== bookLeaf || event.propertyName !== "transform")) return;
    if (!bookBusy) return;
    clearTimeout(bookFlipTimer);
    bookFlipTimer = 0;
    bookLeaf.removeEventListener("transitionend", finishFlip);
    bookFlipHandler = null;
    bookPage = next;
    bookFrontImg.src = bookSrc(bookPage);
    const peek = Math.min(currentBookPages.length - 1, bookPage + 1);
    bookUnderImg.src = bookSrc(peek);
    bookBackImg.src = bookSrc(peek);
    bookLeaf.classList.remove("is-turning-forward");
    bookLeaf.classList.remove("is-flipping-forward", "is-flipping-back");
    bookBusy = false;
    updateBookChrome();
  };

  bookFlipHandler = finishFlip;
  bookLeaf.addEventListener("transitionend", finishFlip);
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  bookFlipTimer = window.setTimeout(finishFlip, reducedMotion ? 0 : 1000);
}

mapImage.addEventListener("load", () => {
  if (isTourOpen()) fitImageFrame(tourViewport, mapFrame, mapImage, mapZoom);
});

window.addEventListener("resize", () => {
  fitGalleryImages();
  if (isTourOpen()) fitImageFrame(tourViewport, mapFrame, mapImage, mapZoom);
  if (isSceneOpen()) fitImageFrame(sceneViewport, sceneFrame, scenePhoto, sceneZoom, 0.94);
  if (isBookOpen()) fitBook();
});

bookFrontImg.addEventListener("load", () => {
  if (isBookOpen() && !bookBusy) fitBook();
});

document.querySelector(".nav-btn.prev").addEventListener("click", () => goTo(index - 1));
document.querySelector(".nav-btn.next").addEventListener("click", () => goTo(index + 1));
document.getElementById("galleryFullscreenBtn").addEventListener("click", openLightbox);
document.getElementById("lightboxPrev").addEventListener("click", () => navigateLightbox(-1));
document.getElementById("lightboxNext").addEventListener("click", () => navigateLightbox(1));
document.getElementById("closeLightbox").addEventListener("click", closeLightbox);
document.querySelector("[data-close-lightbox]").addEventListener("click", closeLightbox);
document.getElementById("closeExhibit").addEventListener("click", closeExhibit);
exhibitPhoto.addEventListener("click", () => {
  if (currentExhibitId !== "Stend_about_Chechnya_Afghanistan_WWII(1)_(VI)") return;
  openImageLightbox(exhibitPhoto.src, exhibitPhoto.alt);
});
exhibitPhoto.addEventListener("keydown", (event) => {
  if (
    currentExhibitId !== "Stend_about_Chechnya_Afghanistan_WWII(1)_(VI)" ||
    (event.key !== "Enter" && event.key !== " ")
  ) return;
  event.preventDefault();
  openImageLightbox(exhibitPhoto.src, exhibitPhoto.alt);
});
audioToggle.addEventListener("click", async () => {
  if (!exhibitAudio.paused) {
    stopAudio();
    return;
  }
  audioStatus.hidden = true;
  try {
    await exhibitAudio.play();
  } catch (error) {
    audioStatus.textContent = "Не удалось запустить аудиозапись.";
    audioStatus.hidden = false;
    console.error("Не удалось запустить аудиозапись экспоната.", error);
  }
});
exhibitAudio.addEventListener("play", updateAudioToggle);
exhibitAudio.addEventListener("pause", updateAudioToggle);
exhibitAudio.addEventListener("ended", stopAudio);
exhibitAudio.addEventListener("error", () => {
  audioToggle.disabled = true;
  audioStatus.textContent = "Не удалось загрузить аудиозапись.";
  audioStatus.hidden = false;
});
exhibit.addEventListener("click", (event) => {
  if (event.target === exhibit || event.target === exhibitBlur || event.target.classList.contains("exhibit-dim")) {
    closeExhibit();
  }
});

document.getElementById("walkBtn").addEventListener("click", openTour);
tourContinue.addEventListener("click", showLongitudinalMap);
tourBack.addEventListener("click", showEntranceMap);
document.getElementById("tourExit").addEventListener("click", closeTour);
document.getElementById("closeHint").addEventListener("click", () => {
  tourHint.classList.remove("is-visible");
  window.setTimeout(() => {
    tourHint.hidden = true;
  }, 700);
});
document.getElementById("closeScene").addEventListener("click", closeScene);
document.getElementById("closeBook").addEventListener("click", closeBook);
document.getElementById("bookPrev").addEventListener("click", () => flipBook(-1));
document.getElementById("bookNext").addEventListener("click", () => flipBook(1));

carousel.addEventListener("pointerdown", (event) => {
  startX = event.clientX;
  startY = event.clientY;
});
carousel.addEventListener("pointerup", (event) => {
  const deltaX = event.clientX - startX;
  const deltaY = event.clientY - startY;
  if (Math.abs(deltaX) > 50 && Math.abs(deltaX) > Math.abs(deltaY)) {
    goTo(index + (deltaX < 0 ? 1 : -1));
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    if (isLightboxOpen()) closeLightbox();
    else if (isExhibitOpen()) closeExhibit();
    else if (isBookOpen()) closeBook();
    else if (isSceneOpen()) closeScene();
    else if (isTourOpen()) closeTour();
    return;
  }
  if (isLightboxOpen()) {
    if (lightboxGalleryMode && event.key === "ArrowLeft") navigateLightbox(-1);
    if (lightboxGalleryMode && event.key === "ArrowRight") navigateLightbox(1);
    return;
  }
  if (isBookOpen()) {
    if (event.key === "ArrowLeft") flipBook(-1);
    if (event.key === "ArrowRight") flipBook(1);
    if (event.key === "ArrowUp") flipBook(-1);
    if (event.key === "ArrowDown") flipBook(1);
    return;
  }
  if (isExhibitOpen() || isTourOpen() || isSceneOpen()) return;
  if (event.key === "ArrowLeft") {
    goTo(index - 1);
  }
  if (event.key === "ArrowRight") {
    goTo(index + 1);
  }
});

renderGallery();
renderMapMarkers();
loadAboutAndLinks();