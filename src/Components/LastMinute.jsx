// LastMinute.jsx
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import CardHotel from "./CardHotel";
import CardVolo from "./CardVolo";

function LastMinute({ hotels = [], voli = [] }) {
  // Primi 5 hotel come esempio di "offerte"
  const hotelLastMinute = hotels.slice(0, 5);

  const voliLastMinute = voli.slice(0, 5);
  return (
    <div className="mb-5">
      <h3 className="mb-3">🏨 Offerte Last Minute - Hotel</h3>
      <Swiper
        spaceBetween={20}
        slidesPerView={1}
        breakpoints={{
          768: { slidesPerView: 2 },
          992: { slidesPerView: 3 },
          1200: { slidesPerView: 4 },
        }}
      >
        {hotelLastMinute.map((h) => (
          <SwiperSlide key={h.id}>
            <CardHotel hotel={h} />
          </SwiperSlide>
        ))}
      </Swiper>

      <h3 className="mt-5 mb-3">✈️ Offerte Last Minute - Voli</h3>
      <Swiper
        spaceBetween={20}
        slidesPerView={1}
        breakpoints={{
          768: { slidesPerView: 2 },
          992: { slidesPerView: 3 },
          1200: { slidesPerView: 4 },
        }}
      >
        {voliLastMinute.map((v) => (
          <SwiperSlide key={v.id}>
            <CardVolo volo={v} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

export default LastMinute;
