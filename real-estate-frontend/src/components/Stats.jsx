<section className="py-16 bg-white text-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-bold mb-6"
          >
            Empowering Real Estate with Trust and Innovation
          </motion.h2>

          <Swiper
            modules={[Autoplay]}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            loop
            slidesPerView={3}
            spaceBetween={30}
            breakpoints={{
              0: { slidesPerView: 1 },
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            className="pb-8"
          >
            {[
              { value: '10,000+', text: 'Properties across India.', icon: '🏠' },
              { value: '5,000+', text: 'Happy Customers enjoying their dream homes.', icon: '😊' },
              { value: '50+', text: 'Cities covered with premium listings.', icon: '🌆' },
              { value: '24/7', text: 'Dedicated Support for our customers.', icon: '🕑' },
              { value: '95%', text: 'Client satisfaction across all real estate services.', icon: '💼' },
              { value: '99.9%', text: 'Reliable uptime and platform stability.', icon: '⚙️' },
            ].map((stat, index) => (
              <SwiperSlide key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-black/10 backdrop-blur-md border border-black/10 rounded-2xl p-8 shadow-lg hover:shadow-red-500/20 transition-all duration-300"
                >
                  <div className="text-4xl mb-3">{stat.icon}</div>
                  <h3 className="text-2xl font-semibold text-blue-400 mb-2">{stat.value}</h3>
                  <p className="text-sm text-black-100">{stat.text}</p>
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>