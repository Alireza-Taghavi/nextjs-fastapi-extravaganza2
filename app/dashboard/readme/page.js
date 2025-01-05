"use client";

import { useState } from "react";
import { Button } from "../../../components/ui/button";
import {cn} from "../../../lib/utils";

// ToggleButton Component
function ToggleButton({ isPersian, onClick }) {
    return (
        <Button variant={"secondary"} onClick={onClick}>
            {isPersian ? "English" : "فارسی"}
        </Button>
    );
}

// Section Component
function Section({ title, children, titleClass="text-2xl font-semibold text-primary" }) {
    return (
        <section className="mb-8">
            <h2 className={`${titleClass}`}>{title}</h2>
            {children}
        </section>
    );
}

// List Component
function List({ items, className = "list-disc list-inside space-y-3" }) {
    return (
        <ul className={className}>
            {items.map((item, index) => (
                <li key={index}>{item}</li>
            ))}
        </ul>
    );
}

export default function Readme() {
    const [isPersian, setIsPersian] = useState(false);

    const handleToggleLanguage = () => setIsPersian(!isPersian);

    return (
        <div className="w-full flex flex-col text-pretty px-8 md:px-0 pt-6 pb-16 md:overflow-y-scroll overflow-x-hidden" dir={isPersian ? "rtl" : "ltr"}>
            <div className={cn("mb-4 flex w-full flex-row-reverse px-4")}>
                <ToggleButton isPersian={isPersian} onClick={handleToggleLanguage} />
            </div>

            {isPersian ? (
                <div className={"text-right"}>
                    <p className={"text-xs mb-3"}>تریجحا انگلیسی بخنونید فارسی رو دادم ai ترجمه کنه</p>
                    <h2 className={"text-4xl mb-6"}>به جشن تولدم خوش آمدید</h2>
                    <Section title="شروع جشن">
                        <List
                            items={[
                                <>
                                    <strong>سکه‌های ورودی (اُشلوغ):</strong> به هر کس در بدو ورود تعداد یکسانی سکه
                                    اُشلوغ داده می‌شود. از این سکه‌ها می‌توانید برای موارد زیر استفاده کنید:
                                    <List
                                        items={[
                                            "خرید نوشیدنی‌ها و غذاهای اختصاصی، ...",
                                            "بازی‌ها، کارائوکه، درخواست آهنگ، ...",
                                            "قمار!",
                                            "و خیلی چیزهای دیگر"
                                        ]}
                                        className="list-inside list-disc pl-6"
                                    />
                                </>,
                                <>
                                    <strong>ثبت‌نام:</strong> قبل از جشن وارد پنل شخصی خود شوید تا:
                                    <List
                                        items={[
                                            "تم لباس خود را انتخاب کنید.",
                                            "لیست مهمانان را ببینید و دوستان خود را پیشنهاد دهید."
                                        ]}
                                        className="list-inside list-disc pl-6"
                                    />
                                </>,
                                <>
                                    <strong>افشای مکان:</strong> مکان جشن چند روز قبل از رویداد در وبسایت باز خواهد شد.
                                </>
                            ]}
                        />
                    </Section>
                    <Section title={"تم‌ها و جوایز اضافی"}>
                        <List items={[
                            "تمی برای لباس خود انتخاب کنید و آن را در جشن بپوشید تا سکه‌های اضافی دریافت کنید!",
                            <>
                                برای انتخاب‌های خاص یا متفاوت سکه‌های اضافی تعلق خواهد گرفت. برای مثال:
                                <List
                                    items={[
                                        "اگر بسیاری از مهمانان \"قرمز\" را انتخاب کنند، انتخاب رنگ متفاوتی مانند \"آبی\" سکه‌های اضافی خواهد داشت.",
                                        "این یک رأی‌گیری نیست! فقط تمی را برای خود انتخاب می‌کنید."
                                    ]}
                                    className="list-inside list-disc pl-6"
                                />
                            </>
                        ]}/>
                    </Section>
                    <Section title="امکانات جالب">
                        <List
                            items={[
                                <>
                                    <strong>ماموریت‌ها:</strong> در روز جشن وظایف خاصی را کامل کنید تا سکه کسب کنید.
                                    مثال‌ها:
                                    <List
                                        items={[
                                            "با کسی که تم یکسانی دارد سلفی بگیرید.",
                                            "سه نفر را که نمی‌شناسید پیدا کنید و از آن‌ها تعریف کنید."
                                        ]}
                                        className="list-inside list-disc pl-6"
                                    />
                                </>,
                                "سکه‌های خود را خرج کنید تا جعبه‌های مرموز باز کنید و جوایز جالبی مثل سکه‌های اضافی یا امتیازات ویژه دریافت کنید.",
                                "بازی‌های ساده‌ای در وبسایت انجام دهید تا قبل از جشن سکه کسب کنید.",
                                "با گروهی به جشن بیایید تا سکه‌های اضافی کسب کنید و چالش پارکینگ را حل کنید.",
                                "جوایز به صورت زنده و براساس مشارکت در جشن تنظیم خواهند شد.",
                                "در طول رویداد، به مهمانان تصادفی جوایز اضافی داده خواهد شد. منتظر سورپرایزها باشید!",
                                "از نقشه برای کاوش مکان جشن و یافتن فعالیت‌ها یا سورپرایزهای مخفی استفاده کنید."
                            ]}
                        />
                    </Section>

                    <Section title="جایزه خفن‌ترین فرد">
                        <p>فعال‌ترین و خلاق‌ترین شرکت‌کننده جشن به عنوان <strong>خفن‌ترین فرد</strong> انتخاب می‌شود و
                            پس از جشن جایزه ویژه‌ای دریافت خواهد کرد!</p>
                    </Section>
                    <Section title="خلاق باشید و لذت ببرید!">
                        <p>
                            نمی‌توانم برای دیدنتان صبر کنم! <br/>
                            اونجا می‌بینمتون! 🎉<br/>
                            با عشق برای اکثر شماها،<br/>
                            سینا
                        </p>
                    </Section>
                </div>

            ) : (
                <div>
                    <h2 className={"text-4xl mb-6"}>Welcome To My Birthday Party</h2>
                    <Section title="Getting Started">
                        <List
                            items={[
                                <>
                                    <strong>Entry Coins (OSHLOGH):</strong> Everyone receives the same amount of OSHLOGH
                                    coins upon arrival. Use these coins to:
                                    <List
                                        items={[
                                            "Buy exclusive drinks and food, ...",
                                            "Games, Karaoke, Request Songs, ...",
                                            "GAMBLE!",
                                            "& Alot of other stuff"
                                        ]}
                                        className="list-inside list-disc pl-6"
                                    />
                                </>,
                                <>
                                    <strong>Sign Up:</strong> Log into your personalized panel before the party to:
                                    <List
                                        items={[
                                            "Choose your outfit theme.",
                                            "See the guest list and recommend friends."
                                        ]}
                                        className="list-inside list-disc pl-6"
                                    />
                                </>,
                                <>
                                    <strong>Location Reveal:</strong> The party location will unlock on the website a
                                    few days before the event.
                                </>
                            ]}
                        />
                    </Section>
                    <Section title={"Themes & Bonuses"}>
                        <List items={[
                            "Pick a theme for your outfit and wear it to the party to earn extra coins!",
                            <>
                                Bonus coins will be given for unique or uncommon choices. For example:
                                <List
                                    items={[
                                        "If many guests pick \"Red,\" a different color like \"Blue\" will earn bonus coins.\n",
                                        "IT IS NOT A VOTE!! You are just picking the theme for yourself."
                                    ]}
                                    className="list-inside list-disc pl-6"
                                />
                            </>
                        ]}/>
                    </Section>
                    <Section title="Cool Features">
                        <List
                            items={[
                                <>
                                    <strong>Quests:</strong> Complete unique tasks on the party day to earn coins.
                                    Examples:
                                    <List
                                        items={[
                                            "Take a selfie with someone in the same theme.",
                                            "Find and compliment three people you don’t know."
                                        ]}
                                        className="list-inside list-disc pl-6"
                                    />
                                </>,
                                "Spend coins to open mystery boxes for cool surprises like extra coins or special privileges.",
                                "Play simple games on the website to earn coins before the party begins.",
                                "Arrive with a group to earn extra coins and help solve the parking challenge.",
                                "Bonuses will adjust in real time based on participation at the party.",
                                "Random guests will receive coin bonuses during the event. Stay alert for surprises!",
                                "Use the map to explore the venue and find activities or hidden surprises."
                            ]}
                        />
                    </Section>

                    <Section title="Coolest Person Award">
                        <p>The party's most active and creative participant will be crowned the <strong>Coolest
                            Person</strong> and receive a special prize after the event!</p>
                    </Section>
                    <Section title="Have Fun and Be Creative!">
                        <p>
                            Can't wait to cyall fuckers!! <br/>
                            See you there! 🎉<br/>
                            Love most of you,<br/>
                            Sina
                        </p>
                    </Section>
                </div>
            )}
        </div>

    );
}