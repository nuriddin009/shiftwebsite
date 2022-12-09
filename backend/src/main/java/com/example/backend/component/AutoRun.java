package com.example.backend.component;

import com.example.backend.entity.Role;
import com.example.backend.entity.User;
import com.example.backend.entity.shift.*;
import com.example.backend.entity.studyCenter.ApiKey;
import com.example.backend.entity.studyCenter.Lesson;
import com.example.backend.repository.*;
import com.example.backend.repository.shiftRepo.*;
import com.example.backend.repository.studyCenter.CertificateRepository;
//import com.example.backend.repository.studyCenter.WeekDayRepository;
import com.example.backend.service.studyCenter.GenerateCertificate;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@RequiredArgsConstructor
@Component
public class AutoRun implements CommandLineRunner {

    private final LessonRepository lessonRepository;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final TitleRepo titleRepo;
    private final AboutRepo aboutRepo;
    private final WhyUsRepo whyUsRepo;
    private final CourseRepo courseRepo;
    private final AddressRepo addressRepo;
    private final OurTeamRepo ourTeamRepo;
    private final FollowUsRepo followUsRepo;
    private final ApiKeyRepository apiKeyRepository;
    private final CertificateRepository certificateRepository;
    private final GenerateCertificate generateCertificate;
    private final AttachmentRepository attachmentRepository;
//    private final WeekDayRepository weekDayRepository;

    @Override
    public void run(String... args) throws Exception {
        if (apiKeyRepository.findAll().size() == 0) {
            apiKeyRepository.save(new ApiKey(null, "e513e4115ca510bdadca112d5153afe8", "T2IpKOxq"));
        }

        if (lessonRepository.findAll().size() == 0) {
            for (int i = 1; i <= 12; i++) {
                lessonRepository.save(new Lesson(null, i, null, true));
            }
        }


//        if (weekDayRepository.findAll().size() == 0) {
//            weekDayRepository.saveAll(Arrays.asList(
//                    new WeekDay(null, "Dushanba", 1),
//                    new WeekDay(null, "Seshanba", 2),
//                    new WeekDay(null, "Chorshanba", 3),
//                    new WeekDay(null, "Payshanba", 4),
//                    new WeekDay(null, "Juma", 5),
//                    new WeekDay(null, "Shanba", 6)
//            ));
//        }


//        User user1 = userRepository.findById(UUID.fromString("315f3bf7-2a36-47f8-9a4b-f1958f66271e")).get();
//        Attachment attachment = attachmentRepository.findById(UUID.fromString("f46a94a8-8457-445c-8425-58f2a4f9e11e")).get();
//        if (certificateRepository.findAll().size() == 0) {
//            Certificate certificate = new Certificate();
//            certificate.setUser(user1);
//            Certificate save = certificateRepository.save(certificate);
//
//            byte[] certificate1 = generateCertificate.generateStudentCertificate(
//                    save.getId(),
//                    attachment.getFile(),
//                    "Muhriddin",
//                    "Shodmonov",
//                    "Java Backend",
//                    "This certificate is given to ***\nfor attending and successfully completing Java Backend course."
//            );
//            certificate.setStudyType("Java Backend");
//            certificate.setDescription("This certificate is given to ***\nfor attending and successfully completing Java Backend course.");
//            certificate.setCertificatePhoto(certificate1);
//            certificateRepository.save(certificate);
//        }


        if (roleRepository.findAll().size() == 0) {
            Role role_student = roleRepository.save(new Role(1, "ROLE_STUDENT"));
            Role role_admin = roleRepository.save(new Role(2, "ROLE_ADMIN"));
            Role role_mentor = roleRepository.save(new Role(3, "ROLE_MENTOR"));
            Role role_superadmin = roleRepository.save(new Role(4, "ROLE_SUPERADMIN"));
            userRepository.save(new User("shiftacademy2022", passwordEncoder.encode("shiftacademy2022"), "Abdusobur", "Xalimov", "+998941211112", Arrays.asList(role_admin, role_mentor, role_superadmin), 25, "Buxoro", true, "+998930451564"));
            userRepository.save(new User("qwerty", passwordEncoder.encode("qwerty"), "Nuriddin", "Inoyatov", "+998999686653", Arrays.asList(role_student), 20, "Buxoro", true, "+998999686653"));
        }
        Optional<User> shiftacademy20221 = userRepository.findByUsername("shiftacademy2022");
        if (shiftacademy20221.isPresent()) {
            User user = shiftacademy20221.get();
            Role role = roleRepository.findById(2).get();
            Role role1 = roleRepository.findById(4).get();
            Role role2 = roleRepository.findById(3).get();
            user.setRoles(Arrays.asList(role, role1, role2));
            userRepository.save(user);
        }


        if (followUsRepo.findAll().size() == 0) {
            titleRepo.save(new TitleComponent(
                    "Ready to change\nyour life?",
                    "Hayotinggizni\no'zgartiring!",
                    "Готов к изменениям\nсвою жизнь?",
                    "Learn programming from international expert. Do not miss your chance, just click button and contact with us.",
                    "Xalqaro ekspertdan dasturlashni o'rganing. Imkoniyatingizni qo'ldan boy bermang, shunchaki tugmani bosing va biz bilan bog'laning.",
                    "Учитесь программированию у международного эксперта. Не упустите свой шанс, просто нажмите кнопку и свяжитесь с нами."
            ));
            aboutRepo.save(new AboutComponent(
                    "About Us",
                    "Shift Academy opened in 2021 in Bukhara city. Our Academy is first programming school that have senior international web developer. In our Academy you can learn web program- ming from senior developers. Shift Academy teaches you latest technologies in web programming that is used from web developers in the world. Furthermore, our Academy helps its students to find a job and supports them by the time that they find their own way.",
                    "Biz haqimizda",
                    "О нас",
                    "2021-yilda Buxoro shahrida Shift Akademiyasi ochildi. Bizning Akademiyamiz katta xalqaro veb-ishlab chiqaruvchiga ega bo'lgan birinchi dasturlash maktabidir. Bizning Akademiyada siz katta dasturchilardan veb-dasturlashni o'rganishingiz mumkin. Shift Academy sizga veb-dasturlash bo'yicha dunyodagi veb-dasturchilar tomonidan qo'llaniladigan eng so'nggi texnologiyalarni o'rgatadi. Bundan tashqari, Akademiyamiz o'z talabalariga ish topishda yordam beradi va o'z yo'lini topishi uchun ularni qo'llab-quvvatlaydi.",
                    "Шифт академия открылась в 2021 году в городе Бухара. Наша Академия — первая школа программирования, в которой есть старший международный веб-разработчик. В нашей Академии вы можете научиться веб-программированию у старших разработчиков. Шифт академия обучает вас новейшим технологиям веб-программирования, которые используются веб-разработчиками со всего мира. Кроме того, наша Академия помогает своим студентам найти работу и поддерживает их в то время, когда они находят свой собственный путь."
            ));
            List<WhyUS> whyUSES = new ArrayList<>();
            whyUSES.add(new WhyUS("Modern Technologies", "You will learn latest \n gies regarding web programming.", "Zamonaviy texnologiyalar", "Современные технологииa", "Siz eng yangi narsalarni o'rganasiz\n veb-dasturlash haqida ma'lumot.", "Вы узнаете последние\n о веб-программировании.", null));
            whyUSES.add(new WhyUS("Highly Experienced Mentor", "Students are taught by mentor with international experience.", "Yuqori tajribali murabbiy", "Наставник с большим опытом", "Talabalarga xalqaro tajribaga ega ustoz saboq beradi.", "Студентов обучает наставник с международным опытом.", null));
            whyUSES.add(new WhyUS("Chance to get money back", "You can get your money back within 5 lessons if you are not satisfied the lessons.", "Pulni qaytarib olish imkoniyati", "Шанс вернуть деньги", "You can get your money back within 5 lessons if you are not satisfied the lessons.", "Вы можете вернуть свои деньги в течение 5 уроков, если уроки вас не устраивают.", null));
            whyUsRepo.saveAll(whyUSES);

            List<Course> courses = new ArrayList<>();
            courses.add(new Course("Backend Course", "In backend course you will learn java, database, spring, microservice architecture\n and deploying (aws)", "Backend kursi", "Базовый курс", "Backend kursida siz java, ma'lumotlar bazasi, bahor, mikroservis arxitekturasini o'rganasiz\n va joylashtirish (aws).", "В бэкэнд-курсе вы изучите java, базу данных, spring, микросервисную архитектуру.\n и развертывание (aws).", null));
            courses.add(new Course("Free Practice", "This part of course only for graduates of\n Shift Academy which they will work on\n real projects as a team for 1 month.", "Bepul amaliyot", "Бесплатная практика", "Bu qism, albatta, faqat bitiruvchilar uchun\n Shift Akademiyasi ular ustida ishlaydi\n 1 oy davomida jamoa sifatida haqiqiy loyihalar.", "Эта часть курса только для выпускников\n Shift Academy над которой они будут работать\n реальные проекты в команде за 1 месяц.", null));
            courses.add(new Course("Frontend Course", "In this section you will be taught latest\n technologies which are html5, css3,\n javascript, git, react, webpack and redux.", "Frontend kursi", "Фронтенд-курс", "Ushbu bo'limda sizga eng so'nggi ma'lumotlar beriladi\n html5, css3 kabi texnologiyalar,\n javascript, git, react, webpack va redux.", "В этом разделе вас научат последним\n технологии, такие как html5, css3,\n javascript, git, реакция, веб-пакет и редукс.", null));
            courseRepo.saveAll(courses);

            List<OurTeam> ourTeams = new ArrayList<>();
            ourTeams.add(new OurTeam("Husan Rasulov", "Mern Stack developer", "", "", "Mern Stack dasturchisi", "Разработчик Mern Stack", null));
            ourTeams.add(new OurTeam("Hasan Rasulov", "Python developer", "", "", "Python dasturchisi", "Python-разработчик", null));
            ourTeams.add(new OurTeam("Xalimov Abdusobur", "Senior web developer", "", "", "Katta veb-dasturchi", "Старший веб-разработчик", null));
            ourTeams.add(new OurTeam("Bahodirov Bexruz", "Senior web developer", "", "", "Katta veb-dasturchi", "Старший веб-разработчик", null));
            ourTeamRepo.saveAll(ourTeams);

            addressRepo.save(new Address("Dunya Building, \n 2nd floor, next to \n Bukhara World of Books", "Buxoro kitoblar olami \n yon tarafida \n dunyo binosi 2-qavat", "Здания Дуня, \n 2 этаж, рядом \n с Бухарским миром книги", "+998 94 124 00 41"));

            List<FollowUs> list = new ArrayList<>();
            list.add(new FollowUs("telegram", "https://web.telegram.org/k", "", null));
            list.add(new FollowUs("facebook", "https://www.facebook.com/", "", null));
            list.add(new FollowUs("youtube", "https://www.youtube.com/", "", null));
            list.add(new FollowUs("instagram", "https://www.instagram.com/", "", null));
            followUsRepo.saveAll(list);

        }
    }
}
