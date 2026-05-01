import React, { useMemo, useState } from "react";

const candidates = [
  { city: "Albay", name: "Alexandra Krishna Oriño", image: "https://scontent.fdvo1-1.fna.fbcdn.net/v/t39.30808-6/684213908_122180886326757835_2448435107454216933_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=7b2446&_nc_ohc=r3QplT86eyMQ7kNvwG9ZRJy&_nc_oc=AdrVjTVvfpnkZm4YSy0L2-6Qy7FgVP-3C7YSuZlwHbjj89FYhte5jA-0Ub1EJGqFfA4&_nc_zt=23&_nc_ht=scontent.fdvo1-1.fna&_nc_gid=KVbYX-Cr55AagQhR77HHiw&_nc_ss=7b2a8&oh=00_Af0tBZpS2XrMUmNGpAXM0f9G9JHK9gumk0M1KSbUDGagxg&oe=69F8CA70" },
  { city: "Baguio", name: "Roxie Baeyens", image: "https://scontent.fdvo1-2.fna.fbcdn.net/v/t39.30808-6/684593336_122180887718757835_3599751940426139746_n.jpg?_nc_cat=1&ccb=1-7&_nc_sid=7b2446&_nc_ohc=d1-bdyAL524Q7kNvwGQhbXw&_nc_oc=Adp-8ke8x9L9Byfe8bt7cLvlgHVzpfW4DtjxhO7nCfBanoca-j4TSdX98uHv9SSuApg&_nc_zt=23&_nc_ht=scontent.fdvo1-2.fna&_nc_gid=4ejRQww-OCgzhzwIXvsX5A&_nc_ss=7b2a8&oh=00_Af0X1_ZEmAd-AROjcfZNdkeZedCphya9ECmjmhvmflHFmQ&oe=69F8D3F4" },
  { city: "Cabanatuan City", name: "Princess Ryla Hernandez", note: "Filipino Society of Alberta, Canada", image: "https://scontent.fdvo1-1.fna.fbcdn.net/v/t39.30808-6/684295361_122180886818757835_3905345751890065105_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=7b2446&_nc_ohc=X2KDexXA43wQ7kNvwHUTzjo&_nc_oc=Adpw_BH5J8tL7Q6PU2itIfWK1UfhC3HCllh-fzID-OPhHpik1uQjaxyyXDmYmU2ZdoI&_nc_zt=23&_nc_ht=scontent.fdvo1-1.fna&_nc_gid=vpKiLPpKWz6Z-qrsh2wu5w&_nc_ss=7b2a8&oh=00_Af3Ev5CopnnpHQFQMjvR069DbN9jFZAFU2qXbUhwVT6cOA&oe=69F8D790" },
  { city: "Camiguin", name: "Erica Cadayday", image: "https://scontent.fdvo1-1.fna.fbcdn.net/v/t39.30808-6/685291367_122180887484757835_8548800178849178897_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=7b2446&_nc_ohc=KyVNfRHU828Q7kNvwFP6ss_&_nc_oc=Adq_URazy3JHFQOOek_53BUiYf26i-P87Gs9V8vF0HcdBvesfSxnFU7lUPEIoo15zgk&_nc_zt=23&_nc_ht=scontent.fdvo1-1.fna&_nc_gid=AEBJvsJqAS5x-c7IuelMUQ&_nc_ss=7b2a8&oh=00_Af3T0T70tz2hk5yyYqIMHabDDj3wc32-NFsWmJEjtyT6iw&oe=69F8D810" },
  { city: "Cavite", name: "Jencel Caña", image: "https://scontent.fdvo1-1.fna.fbcdn.net/v/t39.30808-6/685142633_122180887142757835_133892317780534081_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=7b2446&_nc_ohc=-zerUgkS24IQ7kNvwEMqHGN&_nc_oc=AdqJI0c4hueKNahxJtS5ZzmGdr3y3mizxF7vTSXbNHTtVzs3ynm5n7J5qWXPL54eWS4&_nc_zt=23&_nc_ht=scontent.fdvo1-1.fna&_nc_gid=8E66z1oaJFTw0SwhC7dySQ&_nc_ss=7b2a8&oh=00_Af0lrsANJqMyjpeb_Cm5TjAbAZ4DeV0HhgFbhtf70PhEKQ&oe=69F8C32C" },
  { city: "Cebu City", name: "Apriel Smith", image: "https://scontent.fdvo1-2.fna.fbcdn.net/v/t39.30808-6/684737957_122180887874757835_1042546779515364061_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=7b2446&_nc_ohc=FpGaOvjNTkkQ7kNvwGS4O0z&_nc_oc=AdqrPhal0tROZesoNCxnFJypCDzy1ReNwCMD5hFtgPGgockiO5x9zW-OVkc--f0s1Hs&_nc_zt=23&_nc_ht=scontent.fdvo1-2.fna&_nc_gid=TY8_oZZMI5Cd7Awaqrov4Q&_nc_ss=7b2a8&oh=00_Af3nnD_pbcx8lfh8c-qjfI0F-9omHBE6tVamuILOb4448A&oe=69F8B3B2" },
  { city: "Cebu Province", name: "Nicole Borromeo", image: "https://scontent.fdvo1-2.fna.fbcdn.net/v/t39.30808-6/684669010_122180886920757835_8842950161026789360_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=7b2446&_nc_ohc=ooNkdauIKa8Q7kNvwHjiaLa&_nc_oc=AdrF5x7jfg3l1lHVdK7YB1mCTmSTxeDEFcqws1Kl4h-0Ll2xlk1AjHv09oIHcFpsREk&_nc_zt=23&_nc_ht=scontent.fdvo1-2.fna&_nc_gid=7TacB8Lqxr-o2bj5TU9vbw&_nc_ss=7b2a8&oh=00_Af0jmHoVwMRo8z55zPl-w-oUfauNy3wf4hjgw71GDertuw&oe=69F8DA3E" },
  { city: "Cotabato Province", name: "Clarissa Westram", image: "https://scontent.fdvo1-1.fna.fbcdn.net/v/t39.30808-6/683008597_122180887772757835_6359627565270021933_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=7b2446&_nc_ohc=OEDp6v3xPFsQ7kNvwHB0HxY&_nc_oc=AdrlMlG2VW0ScVaWtEDFQFcwIP4cJtxYKFzkbf8eHJo1zDE0q4Prv_OpWNO6uC8fPQ0&_nc_zt=23&_nc_ht=scontent.fdvo1-1.fna&_nc_gid=8mqlbKd7XbLYpcbcSdhK9Q&_nc_ss=7b2a8&oh=00_Af1EzMF1KYRVjL4FJBAbIWqgRtkyOORZoCS8PIVoJq4ing&oe=69F8E58A" },
  { city: "Ilocos Norte", name: "Cherieze Cacayorin", note: "Filipino Society of Hawaii", image: "https://scontent.fdvo1-2.fna.fbcdn.net/v/t39.30808-6/684177803_122180887490757835_363813564615837659_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=7b2446&_nc_ohc=dplxdzBbRecQ7kNvwEQCTM5&_nc_oc=AdovCTLPZ2lkeUMvGWjqnaMkQttjXU3G-rKzU9NSuP7gCnKKdsLg5HEIbWXj7fpbAto&_nc_zt=23&_nc_ht=scontent.fdvo1-2.fna&_nc_gid=ZWzw-kPMZtggtiAuwj-Nng&_nc_ss=7b2a8&oh=00_Af2CYUk0rfMKHQS6At7fzJvje9jtEpHNWUcGVfyrtC3sQQ&oe=69F8D44A" },
  { city: "Iloilo City", name: "Zestah Espinosa", image: "https://scontent.fdvo1-1.fna.fbcdn.net/v/t39.30808-6/684204292_122180887508757835_1487205238201429593_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=7b2446&_nc_ohc=Aq9Rows_mwAQ7kNvwGr2vTw&_nc_oc=AdoN0OQjFZtBVVvdHzmVkAq6GosTcNi1ApeGH-72KxdfZ2WL0CNyLH-W2gujXfN-aBU&_nc_zt=23&_nc_ht=scontent.fdvo1-1.fna&_nc_gid=SlqElcQ1uFwv9oihbtNWKQ&_nc_ss=7b2a8&oh=00_Af2WHaE7_W8jC5zPDL6QPYD0VrK2tx0IIk73f2yIrnT5YQ&oe=69F8B4A1" },
  { city: "La Union", name: "Bea Millan-Windorski", image: "https://scontent.fdvo1-2.fna.fbcdn.net/v/t39.30808-6/684167910_122180887364757835_2196171469952368801_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=7b2446&_nc_ohc=tCHuG4XS6UEQ7kNvwHrhyqM&_nc_oc=Adpv78KfAIvQSBO-NS8UDcWIYemLBe1qRVP_WZgLxWvZzyvn7160YsC7zWfzM9MTKGs&_nc_zt=23&_nc_ht=scontent.fdvo1-2.fna&_nc_gid=vx8i-1vVzw5rxdAo9MsP_A&_nc_ss=7b2a8&oh=00_Af1b4_4h8cCRbSmM5lsZNM4x1V3_RDc8W-qFOhvOY36ASw&oe=69F8DD12" },
  { city: "Laguna", name: "Ysabel Prats", image: "https://scontent.fdvo1-1.fna.fbcdn.net/v/t39.30808-6/684187981_122180888096757835_5949931078914190218_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=7b2446&_nc_ohc=Bgh_R-CBtgQQ7kNvwG3ZH6Q&_nc_oc=Ado4dFdntEp3hoYglZSFSnjo-TETwEXMiR7ISR-CrAjK8sxfR089nB8YOKUnvsGMn28&_nc_zt=23&_nc_ht=scontent.fdvo1-1.fna&_nc_gid=kkrR5mzv11ax-ByWqICCFg&_nc_ss=7b2a8&oh=00_Af15VHzk4A-ufs3_zzp9CmaVtOO4GzdhxgWeaxHLHCCBqw&oe=69F8EA99" },
  { city: "Los Baños, Laguna", name: "Scarlett Anne De Mesa", image: "https://scontent.fdvo1-1.fna.fbcdn.net/v/t39.30808-6/686930666_122180886878757835_2026740024975261994_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=7b2446&_nc_ohc=msw_7xXUHxIQ7kNvwHf-OF7&_nc_oc=AdppnBc34OvM-i6upo9SqT-yI8w3YndTyDCegY64kxLNfcJ6khKC4YE3IsU1AGHHgWc&_nc_zt=23&_nc_ht=scontent.fdvo1-1.fna&_nc_gid=xWMNWNdIdrqxMmwbHTHaGA&_nc_ss=7b2a8&oh=00_Af0niJOwfkFfTnsxos0-GNHPE9qObVkci4rfXc8ip33ZFA&oe=69F8CFB3" },
  { city: "Manila", name: "Justine Felizarta", image: "https://scontent.fdvo1-1.fna.fbcdn.net/v/t39.30808-6/685898944_122180887094757835_2566189146898081887_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=7b2446&_nc_ohc=TDcxgMqqqMgQ7kNvwFFYMPn&_nc_oc=AdrLzKBQhGOEp3jE8ERmM04x5I18_Lt_fL9-0KTVFGtyndhEQP95_my5p-55TEctmhQ&_nc_zt=23&_nc_ht=scontent.fdvo1-1.fna&_nc_gid=S8efQjdUz8v_qXWAHsOMDg&_nc_ss=7b2a8&oh=00_Af3Xlwbz8bevTJeYobQcO0UBWGu1FkCnwHqv0PpNcphdvw&oe=69F8DD03" },
  { city: "Mountain Province", name: "Lyneree Montero-Yodong", image: "https://scontent.fdvo1-1.fna.fbcdn.net/v/t39.30808-6/684962591_122180886824757835_8342728599116549745_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=7b2446&_nc_ohc=cEJtWDjAkZ4Q7kNvwEVq8z4&_nc_oc=AdoNZFl4PNfIRD2UkaROqYALxNgIdx0BADfxOY_XOBi046Sg4C5RPBwXNK23JuQyWvg&_nc_zt=23&_nc_ht=scontent.fdvo1-1.fna&_nc_gid=fSODsKSTIKoHkcYi_WF5jQ&_nc_ss=7b2a8&oh=00_Af2QgORW1OeMcRhAAQytHGbZpYFDKxLR35hJgicmndp54A&oe=69F8D8F1" },
  { city: "Muntinlupa", name: "Adela-Mae Marshall", image: "https://scontent.fdvo1-1.fna.fbcdn.net/v/t39.30808-6/682857741_122180888066757835_553493129562279012_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=7b2446&_nc_ohc=Rh304BBwVMYQ7kNvwHlKpGX&_nc_oc=AdqBGVm1rX2WWN9VMQ7QWJ5aFS9W49NE6ctBhnT7Aag5T2s9ZXuaHIb5ICvSPfnAYuI&_nc_zt=23&_nc_ht=scontent.fdvo1-1.fna&_nc_gid=9D3mIK7lPQNq9pLypspNHg&_nc_ss=7b2a8&oh=00_Af0zuAYaPw3pVXTPWPD_LqA89BNpFgrJezT_asEbs3TDgw&oe=69F8CF1D" },
  { city: "Negros Occidental", name: "Alexandra Colmenares", image: "https://scontent.fdvo1-1.fna.fbcdn.net/v/t39.30808-6/684159041_122180888030757835_3187634699883934397_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=7b2446&_nc_ohc=yalvHZBYL5YQ7kNvwGvEzPx&_nc_oc=AdrWPO13JTp8cdfpnhpjWs2pU4m-X6Nc72EGXWtuJMc39G0Apj5LesxdqeZ2p7ZdHUI&_nc_zt=23&_nc_ht=scontent.fdvo1-1.fna&_nc_gid=qw_46eI5t6M9y0_TSB-Pvg&_nc_ss=7b2a8&oh=00_Af1PiXXnDHSS385FQZ6Bd2Wu48MiyX5PIg0Z3ce2YSYErg&oe=69F8BA78" },
  { city: "Nueva Ecija", name: "Michelle Burchelle", note: "Filipino Society of the United Kingdom", image: "https://scontent.fdvo1-2.fna.fbcdn.net/v/t39.30808-6/684247337_122180888120757835_2873593610779808388_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=7b2446&_nc_ohc=FixWa2YaQ3MQ7kNvwHGOOHl&_nc_oc=AdrD6jTqbAoMzYi00lFfDhGo_nIrkYyaiO7KYTABfNCsa6mP7rMURKqijLvVr5Tl4vE&_nc_zt=23&_nc_ht=scontent.fdvo1-2.fna&_nc_gid=ehgoAGR5NIM6nM77TjNpOA&_nc_ss=7b2a8&oh=00_Af3FcCBiBunVpzvjMBQdxVOWu_LXJkLbyds4y9ylVYx3yw&oe=69F8D91D" },
  { city: "Nueva Vizcaya", name: "Jacqueline Aluning", note: "Filipino Society of Washington", image: "https://scontent.fdvo1-2.fna.fbcdn.net/v/t39.30808-6/682941818_122180888102757835_7601918685154363428_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=7b2446&_nc_ohc=VFGouKjo1VEQ7kNvwGBz4os&_nc_oc=Adrq2Q1Rt_RE_BaHGrbx5e54nZoS74dAdRMrqbStgBRUiSIqovZfSawA66nlEvfAZ94&_nc_zt=23&_nc_ht=scontent.fdvo1-2.fna&_nc_gid=BKUX2_SHUAESDBdBsZ_pww&_nc_ss=7b2a8&oh=00_Af0lCuvtjssxkSBBmwT7EmBij_cGLoTajgrX8LZ_QGGrIg&oe=69F8D523" },
  { city: "Occidental Mindoro", name: "Neil Silva", image: "https://scontent.fdvo1-2.fna.fbcdn.net/v/t39.30808-6/684153636_122180886926757835_716191266943676171_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=7b2446&_nc_ohc=TbgFgs_l2UIQ7kNvwG5hi4B&_nc_oc=Adp-x7qi6aFz4as7OiET3BRKNcvhOxCWC-TRnHAx9jU_wFIooeipxwHF1JxjzlxfgTU&_nc_zt=23&_nc_ht=scontent.fdvo1-2.fna&_nc_gid=BAlonjb08mfciz5XVT_W5g&_nc_ss=7b2a8&oh=00_Af1MXGNtPIOoto6VSFaqrsGIfjcLNBbmKj0pQENXEn19lA&oe=69F8C885" },
  { city: "Pampanga", name: "Allyson Hetland", image: "https://scontent.fdvo1-2.fna.fbcdn.net/v/t39.30808-6/685750334_122180887760757835_1778019681656030687_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=7b2446&_nc_ohc=DyGf3B2ONEMQ7kNvwGwL62L&_nc_oc=Adp86DPhypFsNXSOREQu6fXm83eAvph_67BeqOKkVyqXRUYj2_tXnYw8vvjn-F_LE9A&_nc_zt=23&_nc_ht=scontent.fdvo1-2.fna&_nc_gid=HC2E0IbeeqiXmpBCUB74DA&_nc_ss=7b2a8&oh=00_Af3xt5aOfxgdq23kk3-at0KqDhjLPQ7KdZvlhdzLbFoDNA&oe=69F8DD78" },
  { city: "Pangasinan", name: "Donna Rein Nuguid", image: "https://scontent.fdvo1-1.fna.fbcdn.net/v/t39.30808-6/684258786_122180888018757835_1479063812718583501_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=7b2446&_nc_ohc=DQk1LHKBDwMQ7kNvwEtSm7b&_nc_oc=AdrisRsdZd5T9cd4oFxsAS4A1J-3CZmcq03zuzDAeXXlGGGEgPb1oePzk08_d2KVitU&_nc_zt=23&_nc_ht=scontent.fdvo1-1.fna&_nc_gid=ZWmiZetTz28Kj1bIbW06Wg&_nc_ss=7b2a8&oh=00_Af2F0PW6gCZtfRW815KpQJu_scUO3dCWJa1UBr3OUqe8ow&oe=69F8E13B" },
  { city: "Quezon Province", name: "Patricia Ella Evangelista", image: "https://scontent.fdvo1-2.fna.fbcdn.net/v/t39.30808-6/680140065_122180886368757835_5632201502814587683_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=7b2446&_nc_ohc=l4JYAutaSCQQ7kNvwFznwRl&_nc_oc=Adp-nLDBye2zyTmBqd67OQouRpFmFkkQDFWO9EwHiGtXwoJIH_8p4T3i7raQag2Eb3Q&_nc_zt=23&_nc_ht=scontent.fdvo1-2.fna&_nc_gid=EnAOAs_I3AjggIxbYP0DoA&_nc_ss=7b2a8&oh=00_Af367pq5Qek4mhZXRl-K31BV_v7MsMrkER5tZj5cn32FlQ&oe=69F8D9DB" },
  { city: "Rizal", name: "Alicia Buendia", note: "Filipino Society of Southern California", image: "https://scontent.fdvo1-2.fna.fbcdn.net/v/t39.30808-6/684485267_122180888144757835_2962381684903699260_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=7b2446&_nc_ohc=Cg0rYEH1HR0Q7kNvwERwtG8&_nc_oc=AdrjuqcSzZx7ZkT7urYkzbOo5nLu8nbOoiWihoiiI4fkEJO11Tuv0vGh5GX4LXFquUQ&_nc_zt=23&_nc_ht=scontent.fdvo1-2.fna&_nc_gid=or0-PVC05rvTfxbw9UuieA&_nc_ss=7b2a8&oh=00_Af2vMlFLXGYSyWB0hYjrwfz3t2SdLsVmc5XqqobXXgE1iw&oe=69F8D5F8" },
  { city: "Samar Island", name: "Catherine Wardle", image: "https://scontent.fdvo1-2.fna.fbcdn.net/v/t39.30808-6/685047596_122180887400757835_793296236548822332_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=7b2446&_nc_ohc=23OILZkMVUYQ7kNvwHGPf8X&_nc_oc=AdroidQp5B9fb017jaMMUOcRrgVt8kG3gMT2A9Qu3fFnoOg3BlECu8x0iIouPJYVjEU&_nc_zt=23&_nc_ht=scontent.fdvo1-2.fna&_nc_gid=kwsftgqhffD77tZVyKwRFQ&_nc_ss=7b2a8&oh=00_Af0pSvn05Z_bdy5vF97YERah0qfKPRxDHMrJyuieDirlQw&oe=69F8C35B" },
  { city: "San Jose, Negros Oriental", name: "Jayka Munsayac", note: "Filipino Society of Bellevue, Washington", image: "https://scontent.fdvo1-2.fna.fbcdn.net/v/t39.30808-6/685139338_122180887250757835_1367921478471272560_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=7b2446&_nc_ohc=5jGX-r6lGOwQ7kNvwHqdSqD&_nc_oc=Adqh29O91DLEPMEFHLLPaqWO9W9ijRx9sstC5zx-4VZWluM5d4idIMaSIZLGLZpnSfU&_nc_zt=23&_nc_ht=scontent.fdvo1-2.fna&_nc_gid=cbXWpwUQ9QUSCZUez-1XqQ&_nc_ss=7b2a8&oh=00_Af3Ss_xpGI9tV-7m7xCHWiWZqc3HeQkqN87Hxdx09E6iMw&oe=69F8D2CA" },
  { city: "Sultan Kudarat", name: "Jenrose Javier", image: "https://scontent.fdvo1-2.fna.fbcdn.net/v/t39.30808-6/684214709_122180888174757835_6781950486152314212_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=7b2446&_nc_ohc=zXAoFMsxSxoQ7kNvwGeF1yy&_nc_oc=AdrijHKC3u_zO11D3ctOuiCuaYQicOeB8Nm0RuOaR3AAuM9_1FhQQWuPxhC7TzI8R08&_nc_zt=23&_nc_ht=scontent.fdvo1-2.fna&_nc_gid=vpP1pcbSnDH8hNE2Sj-zBg&_nc_ss=7b2a8&oh=00_Af3B99EfvtrmXNcIbbuwuP0UexLmTuNFy36948JvIrYLLg&oe=69F8E4C8" },
  { city: "Tacloban City", name: "Jacqueline Gulrajani", image: "https://scontent.fdvo1-1.fna.fbcdn.net/v/t39.30808-6/684279037_122180888150757835_4970074467776354710_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=7b2446&_nc_ohc=x5DjZUJBU_kQ7kNvwERkcmI&_nc_oc=AdqZX46yUbl2ZfwL2fcV5akR25Du_XoCcWR3X3UcJor8ldahbiznR9i2Sg-zpTS2yNM&_nc_zt=23&_nc_ht=scontent.fdvo1-1.fna&_nc_gid=3I8j6CWstYLrRVvOACc0pg&_nc_ss=7b2a8&oh=00_Af3C2TYdIvWcrjFmpN4DDPHsdq9hU2If1Q0ZKyBZyja4Ng&oe=69F8D31D" },
  { city: "Taguig", name: "Ysabella Ysmael", image: "https://scontent.fdvo1-2.fna.fbcdn.net/v/t39.30808-6/682843490_122180887706757835_7517361211844359379_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=7b2446&_nc_ohc=uBIdGgofJcAQ7kNvwHP-gX3&_nc_oc=AdqCcg4cQMr97rCXDDFnf6q50CQ9EdlkQNFh4OMVrkvgvKwWxq3NOBg10D2pa4dWliI&_nc_zt=23&_nc_ht=scontent.fdvo1-2.fna&_nc_gid=Jc3nsrIh1HcWhecItj9rUg&_nc_ss=7b2a8&oh=00_Af0PKhGKbaTlMFbxNMoeAdAJNFcjz7fUQk1A-0-vMjlpYw&oe=69F8D363" },
  { city: "Tandag City", name: "Chrystel Mae Correos", image: "https://scontent.fdvo1-1.fna.fbcdn.net/v/t39.30808-6/684246592_122180887856757835_4254367447244113512_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=7b2446&_nc_ohc=QYikFm9XkgMQ7kNvwFM3qAq&_nc_oc=AdoPmvhFwA-hB1P6GZnTFiRUwu6EgWizqyOAmx8lI_FHJdsTooOiqaGvM6nqWkAVl0k&_nc_zt=23&_nc_ht=scontent.fdvo1-1.fna&_nc_gid=rC7oleczNbxZGYdlUXp79g&_nc_ss=7b2a8&oh=00_Af3y0vjyfAa3SR0Abm5T54crQx4qLiyOfwCnWTaaxu0hiA&oe=69F8BA7E" },
  { city: "Tarlac", name: "Marian Arellano", image: "https://scontent.fdvo1-1.fna.fbcdn.net/v/t39.30808-6/685142633_122180888162757835_2750101556161659682_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=7b2446&_nc_ohc=M3lGtPOsTyYQ7kNvwFiUSxI&_nc_oc=Adq3ys1gVFrXZhidLlKRb_L6xPjYBDYz2gl157PwU7lWbScJkz0u-EpDCjr_uxseW_U&_nc_zt=23&_nc_ht=scontent.fdvo1-1.fna&_nc_gid=OEpFRv3fJcwl1TKVOeDyrQ&_nc_ss=7b2a8&oh=00_Af1MI1YkYEHReli1miBtSEVyY1OBqfuew1LrUog5yIuApA&oe=69F8E47C" },
].map((candidate, index) => ({ ...candidate, id: index + 1 }));

const preliminaryCriteria = [
  { key: "swimsuit", label: "Swimsuit", weight: 50 },
  { key: "evening", label: "Evening Gown", weight: 50 },
];

const titleOrder = [
  "Miss Universe Philippines 2026",
  "Miss Supranational Philippines 2026",
  "Miss Cosmo Philippines 2026",
  "Miss Charm Philippines 2026",
  "Miss Eco International Philippines 2026",
  "Miss Universe Philippines 1st Runner Up",
  "Miss Universe Philippines 2nd Runner Up",
];

function clampScore(value) {
  if (value === "") return "";
  const number = Number(value);
  if (Number.isNaN(number)) return "";
  return Math.max(0, Math.min(100, number));
}

function getInitials(name) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

function getPreliminaryTotal(score = {}) {
  const swimsuit = Number(score.swimsuit || 0) * 0.5;
  const evening = Number(score.evening || 0) * 0.5;
  return Number((swimsuit + evening).toFixed(2));
}

function getFinalTotal(score = {}) {
  return Number(Number(score.qa || 0).toFixed(2));
}

function getPreliminaryCompletion(score = {}) {
  return preliminaryCriteria.filter((item) => score[item.key] !== "" && score[item.key] !== undefined).length;
}

function getFinalCompletion(score = {}) {
  return score.qa !== "" && score.qa !== undefined ? 1 : 0;
}

function CandidatePhoto({ candidate, className = "" }) {
  const [broken, setBroken] = useState(false);

  if (!candidate.image || broken) {
    return (
      <div className={`grid place-items-center bg-neutral-100 text-neutral-950 ${className}`}>
        <div className="grid h-14 w-14 place-items-center rounded-full border border-neutral-200 bg-white text-lg font-semibold shadow-sm">
          {getInitials(candidate.name)}
        </div>
      </div>
    );
  }

  return (
    <img
      src={candidate.image}
      alt={`${candidate.name} representing ${candidate.city}`}
      className={`object-cover ${className}`}
      loading="lazy"
      onError={() => setBroken(true)}
    />
  );
}

function StatCard({ label, value }) {
  return (
    <div className="rounded-[24px] border border-neutral-200/70 bg-white px-5 py-4 shadow-sm">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-400">{label}</p>
      <p className="mt-2 text-3xl font-semibold tracking-[-0.055em] text-neutral-950">{value}</p>
    </div>
  );
}

export default function App() {
  const [query, setQuery] = useState("");
  const [scores, setScores] = useState({});
  const [top15Submitted, setTop15Submitted] = useState(false);
  const [finalSubmitted, setFinalSubmitted] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationMessage, setVerificationMessage] = useState(
    "Top 15 is hidden first. Submit swimsuit and evening gown scores to verify the semifinalists."
  );

  const preliminaryRanking = useMemo(() => {
    return candidates
      .map((candidate) => {
        const score = scores[candidate.id] || {};
        return {
          ...candidate,
          score,
          preliminaryTotal: getPreliminaryTotal(score),
          preliminaryCompleted: getPreliminaryCompletion(score),
        };
      })
      .sort((a, b) => {
        if (b.preliminaryTotal !== a.preliminaryTotal) return b.preliminaryTotal - a.preliminaryTotal;
        if (b.preliminaryCompleted !== a.preliminaryCompleted) return b.preliminaryCompleted - a.preliminaryCompleted;
        return a.id - b.id;
      });
  }, [scores]);

  const top15 = top15Submitted
    ? preliminaryRanking.slice(0, 15).map((candidate, index) => ({ ...candidate, placement: index + 1 }))
    : [];

  const top15Ids = useMemo(() => new Set(top15.map((candidate) => candidate.id)), [top15]);

  const finalRanking = useMemo(() => {
    return top15
      .map((candidate) => {
        const score = scores[candidate.id] || {};
        return {
          ...candidate,
          score,
          finalTotal: getFinalTotal(score),
          finalCompleted: getFinalCompletion(score),
        };
      })
      .sort((a, b) => {
        if (b.finalTotal !== a.finalTotal) return b.finalTotal - a.finalTotal;
        if (b.preliminaryTotal !== a.preliminaryTotal) return b.preliminaryTotal - a.preliminaryTotal;
        return a.placement - b.placement;
      });
  }, [scores, top15]);

  const top7 = finalSubmitted
    ? finalRanking.slice(0, 7).map((candidate, index) => ({
        ...candidate,
        title: titleOrder[index],
        placement: index + 1,
      }))
    : [];

  const filteredCandidates = candidates.filter((candidate) => {
    const clean = query.trim().toLowerCase();
    if (!clean) return true;
    return candidate.name.toLowerCase().includes(clean) || candidate.city.toLowerCase().includes(clean);
  });

  const updateScore = (candidateId, key, value) => {
    const cleanValue = clampScore(value);

    if (key === "swimsuit" || key === "evening") {
      setTop15Submitted(false);
      setFinalSubmitted(false);
      setVerificationMessage("Preliminary scores were updated. Submit again to verify the Top 15.");
    }

    if (key === "qa") {
      setFinalSubmitted(false);
      setVerificationMessage("Q&A scores were updated. Submit final scores again to reveal the Top 7 titleholders.");
    }

    setScores((current) => ({
      ...current,
      [candidateId]: {
        ...(current[candidateId] || {}),
        [key]: cleanValue,
      },
    }));
  };

  const clearScores = () => {
    setScores({});
    setTop15Submitted(false);
    setFinalSubmitted(false);
    setIsVerifying(false);
    setVerificationMessage("Top 15 is hidden first. Submit swimsuit and evening gown scores to verify the semifinalists.");
  };

  const handleSubmitTop15 = () => {
    const incompleteCandidates = candidates.filter(
      (candidate) => getPreliminaryCompletion(scores[candidate.id]) < preliminaryCriteria.length
    );

    if (incompleteCandidates.length > 0) {
      setTop15Submitted(false);
      setFinalSubmitted(false);
      setVerificationMessage(
        `Top 15 verification failed: ${incompleteCandidates.length} candidate${incompleteCandidates.length === 1 ? "" : "s"} still need swimsuit and evening gown scores.`
      );
      return;
    }

    setIsVerifying(true);
    setVerificationMessage("Verifying swimsuit and evening gown scores for the Top 15...");

    window.setTimeout(() => {
      setIsVerifying(false);
      setTop15Submitted(true);
      setFinalSubmitted(false);
      setVerificationMessage("Top 15 verified. You can now enter Q&A scores for the Top 15 only, then submit final scores for the Top 7.");
    }, 1200);
  };

  const handleSubmitFinal = () => {
    if (!top15Submitted) {
      setVerificationMessage("Submit and verify the Top 15 first before entering Q&A scores.");
      return;
    }

    const incompleteFinalists = top15.filter((candidate) => getFinalCompletion(scores[candidate.id]) < 1);

    if (incompleteFinalists.length > 0) {
      setFinalSubmitted(false);
      setVerificationMessage(
        `Final verification failed: ${incompleteFinalists.length} Top 15 candidate${incompleteFinalists.length === 1 ? "" : "s"} still need Q&A scores.`
      );
      return;
    }

    setIsVerifying(true);
    setVerificationMessage("Verifying Q&A scores for the Top 15 and calculating the Top 7...");

    window.setTimeout(() => {
      setIsVerifying(false);
      setFinalSubmitted(true);
      setVerificationMessage("Final scores verified. Official Top 7 titleholders are now revealed.");
    }, 1200);
  };

  const preliminaryCompletedCandidates = candidates.filter(
    (candidate) => getPreliminaryCompletion(scores[candidate.id]) === preliminaryCriteria.length
  ).length;
  const qaCompletedCandidates = top15.filter((candidate) => getFinalCompletion(scores[candidate.id]) === 1).length;
  const highestScore = finalSubmitted ? top7[0]?.finalTotal?.toFixed(2) || "0.00" : "—";

  return (
    <div className="min-h-screen bg-[#f7f7f8] text-neutral-950">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-[-260px] h-[620px] w-[900px] -translate-x-1/2 rounded-full bg-white blur-3xl" />
        <div className="absolute right-[-220px] top-24 h-[520px] w-[520px] rounded-full bg-neutral-200/70 blur-3xl" />
      </div>

      <header className="relative mx-auto max-w-[1440px] px-5 pt-5 sm:px-8 lg:px-10">
        <div className="mb-4 text-center text-sm font-semibold uppercase tracking-[0.18em] text-neutral-500">
          Website created by Tina Rasha
        </div>

        <nav className="flex flex-col gap-4 rounded-[28px] border border-neutral-200/70 bg-white/80 px-5 py-4 shadow-[0_20px_70px_rgba(0,0,0,0.045)] backdrop-blur-2xl md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-neutral-400">One Judge Panel</p>
            <h1 className="mt-1 text-2xl font-semibold tracking-[-0.045em]">Miss Universe Philippines 2026 Scoring System</h1>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <a href="#results" className="rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm font-semibold text-neutral-700 transition hover:border-neutral-950 hover:text-neutral-950">
              Results
            </a>
            <a href="#scorecards" className="rounded-full bg-neutral-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-neutral-800">
              Scorecards
            </a>
            <button
              onClick={top15Submitted ? handleSubmitFinal : handleSubmitTop15}
              disabled={isVerifying}
              className="rounded-full bg-neutral-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isVerifying ? "Verifying..." : top15Submitted ? "Submit Final Scores" : "Submit Top 15 Scores"}
            </button>
            <button onClick={clearScores} className="rounded-full border border-red-100 bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-100">
              Clear
            </button>
          </div>
        </nav>

        <section className="grid gap-8 py-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:py-16">
          <div>
            <div className="mb-5 inline-flex rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm font-semibold text-neutral-500 shadow-sm">
              Top 15: Swimsuit 50% · Evening Gown 50% | Top 7: Q&A 100%
            </div>
            <h2 className="max-w-5xl text-5xl font-semibold leading-[0.94] tracking-[-0.075em] md:text-7xl lg:text-8xl">
              Miss Universe Philippines 2026 Scoring System
            </h2>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-neutral-500">
              First, score all candidates in swimsuit and evening gown to reveal the Top 15. Then enter Q&A scores only for the Top 15 to reveal the Top 7 titleholders.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-2">
            <StatCard label="Candidates" value="31" />
            <StatCard label="Top 15 Ready" value={preliminaryCompletedCandidates} />
            <StatCard label="Q&A Ready" value={top15Submitted ? `${qaCompletedCandidates}/15` : "—"} />
            <StatCard label="Highest Final" value={highestScore} />
            <button
              onClick={top15Submitted ? handleSubmitFinal : handleSubmitTop15}
              disabled={isVerifying}
              className="col-span-2 rounded-[24px] bg-neutral-950 px-5 py-4 text-left text-sm font-semibold text-white shadow-sm transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60 sm:col-span-4 lg:col-span-2"
            >
              <span className="block text-[11px] uppercase tracking-[0.18em] text-white/45">Current Stage</span>
              <span className="mt-2 block text-2xl tracking-[-0.04em]">
                {isVerifying ? "Verifying Scores..." : top15Submitted ? "Submit Final Q&A" : "Submit Top 15"}
              </span>
            </button>
          </div>
        </section>
      </header>

      <main className="relative mx-auto max-w-[1440px] px-5 pb-20 sm:px-8 lg:px-10">
        <section id="results" className="mb-8 overflow-hidden rounded-[34px] border border-neutral-200/70 bg-white shadow-[0_24px_90px_rgba(0,0,0,0.06)]">
          <div className="border-b border-neutral-100 px-5 py-5 md:px-7">
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-neutral-400">Live Ranking</p>
                <h2 className="mt-2 text-4xl font-semibold tracking-[-0.06em] md:text-6xl">Automatic Results</h2>
              </div>
              <p className="max-w-md text-sm leading-6 text-neutral-500">
                Top 15 is based only on swimsuit and evening gown. Top 7 is based on Q&A scores from the Top 15.
              </p>
            </div>
          </div>

          <div className="px-5 py-6 md:px-7">
            <div className={`mb-6 rounded-[26px] border px-5 py-4 ${finalSubmitted ? "border-green-100 bg-green-50 text-green-700" : verificationMessage.includes("failed") ? "border-red-100 bg-red-50 text-red-700" : "border-neutral-200 bg-neutral-50 text-neutral-600"}`}>
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] opacity-60">Verification Status</p>
                  <p className="mt-1 text-sm font-semibold">{verificationMessage}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button onClick={handleSubmitTop15} disabled={isVerifying} className="rounded-full border border-neutral-200 bg-white px-5 py-3 text-sm font-semibold text-neutral-950 transition hover:border-neutral-950 disabled:cursor-not-allowed disabled:opacity-60">
                    {top15Submitted ? "Top 15 Verified" : "Submit Top 15 Scores"}
                  </button>
                  <button onClick={handleSubmitFinal} disabled={isVerifying || !top15Submitted} className="rounded-full bg-neutral-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-40">
                    {finalSubmitted ? "Final Verified" : "Submit Final Q&A"}
                  </button>
                </div>
              </div>
            </div>

            <div className="mb-10">
              <div className="mb-5 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-neutral-400">Semifinalists</p>
                  <h3 className="mt-1 text-3xl font-semibold tracking-[-0.05em] md:text-4xl">Top 15</h3>
                </div>
                <p className="text-sm text-neutral-500">Determined by swimsuit + evening gown only</p>
              </div>

              <div className="overflow-hidden rounded-[28px] border border-neutral-200 bg-white">
                <div className="hidden grid-cols-[88px_1.4fr_1fr_140px] gap-px bg-neutral-200 text-sm font-semibold text-neutral-500 md:grid">
                  <div className="bg-neutral-50 px-4 py-3">Rank</div>
                  <div className="bg-neutral-50 px-4 py-3">Candidate</div>
                  <div className="bg-neutral-50 px-4 py-3">City / Province</div>
                  <div className="bg-neutral-50 px-4 py-3 text-right">Prelim Score</div>
                </div>

                <div className="divide-y divide-neutral-100">
                  {top15Submitted
                    ? top15.map((candidate) => (
                        <div key={candidate.id} className="grid gap-3 px-4 py-4 md:grid-cols-[88px_1.4fr_1fr_140px] md:items-center md:gap-0">
                          <div className="text-sm font-semibold text-neutral-900">#{candidate.placement}</div>
                          <div className="flex items-center gap-3">
                            <div className="h-12 w-12 overflow-hidden rounded-full bg-neutral-100">
                              <CandidatePhoto candidate={candidate} className="h-full w-full" />
                            </div>
                            <div className="min-w-0">
                              <p className="truncate text-sm font-semibold text-neutral-950">{candidate.name}</p>
                              <p className="text-xs text-neutral-400 md:hidden">{candidate.city}</p>
                            </div>
                          </div>
                          <div className="hidden text-sm text-neutral-500 md:block">{candidate.city}</div>
                          <div className="text-left text-lg font-semibold tracking-[-0.03em] text-neutral-950 md:text-right">{candidate.preliminaryTotal.toFixed(2)}</div>
                        </div>
                      ))
                    : Array.from({ length: 15 }).map((_, index) => (
                        <div key={index} className="grid gap-3 px-4 py-4 md:grid-cols-[88px_1.4fr_1fr_140px] md:items-center md:gap-0">
                          <div className="text-sm font-semibold text-neutral-300">#{index + 1}</div>
                          <div className="flex items-center gap-3">
                            <div className="h-12 w-12 rounded-full bg-neutral-100" />
                            <div className="h-4 w-40 rounded-full bg-neutral-100" />
                          </div>
                          <div className="hidden h-4 w-32 rounded-full bg-neutral-100 md:block" />
                          <div className="h-4 w-16 rounded-full bg-neutral-100 md:ml-auto" />
                        </div>
                      ))}
                </div>
              </div>
            </div>

            <div>
              <div className="mb-5 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-neutral-400">Finalists</p>
                  <h3 className="mt-1 text-3xl font-semibold tracking-[-0.05em] md:text-4xl">Top 7 Titleholders</h3>
                </div>
                <p className="text-sm text-neutral-500">Determined by Q&A scores from the Top 15</p>
              </div>

              <div className="grid gap-4 lg:grid-cols-4">
                {!finalSubmitted && (
                  <div className="rounded-[30px] border border-dashed border-neutral-200 bg-neutral-50 p-8 text-center lg:col-span-4">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-neutral-400">Awaiting Final Verification</p>
                    <h4 className="mt-3 text-3xl font-semibold tracking-[-0.05em] text-neutral-950">Top 7 titleholders are hidden</h4>
                    <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-neutral-500">
                      Reveal the Top 15 first, enter Q&A scores for those semifinalists, then submit final scores to reveal the titleholders.
                    </p>
                  </div>
                )}

                {finalSubmitted && top7[0] && (
                  <div className="overflow-hidden rounded-[30px] border border-neutral-200 bg-neutral-950 text-white shadow-[0_24px_70px_rgba(0,0,0,0.16)] lg:col-span-2 lg:row-span-2">
                    <div className="grid gap-0 md:grid-cols-[0.85fr_1fr] lg:h-full">
                      <div className="aspect-[4/5] overflow-hidden bg-neutral-900 md:aspect-auto">
                        <CandidatePhoto candidate={top7[0]} className="h-full w-full" />
                      </div>
                      <div className="flex flex-col justify-between p-6 md:p-8">
                        <div>
                          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/45">Overall Winner</p>
                          <h3 className="mt-3 text-4xl font-semibold leading-[0.95] tracking-[-0.06em] md:text-5xl">{top7[0].title}</h3>
                          <div className="mt-6 h-px w-full bg-white/10" />
                          <p className="mt-6 text-2xl font-semibold tracking-[-0.04em]">{top7[0].name}</p>
                          <p className="mt-1 text-base text-white/55">{top7[0].city}</p>
                        </div>
                        <div className="mt-8 rounded-[24px] border border-white/10 bg-white/10 p-5">
                          <p className="text-sm text-white/50">Q&A Score</p>
                          <p className="mt-1 text-6xl font-semibold tracking-[-0.07em]">{top7[0].finalTotal.toFixed(2)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {finalSubmitted && top7.slice(1).map((candidate) => (
                  <div key={candidate.id} className="rounded-[28px] border border-neutral-200 bg-white p-4 shadow-sm">
                    <div className="flex gap-4">
                      <div className="h-24 w-20 shrink-0 overflow-hidden rounded-[20px] bg-neutral-100">
                        <CandidatePhoto candidate={candidate} className="h-full w-full" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="mb-2 inline-flex rounded-full bg-neutral-100 px-2.5 py-1 text-[11px] font-semibold text-neutral-500">Rank #{candidate.placement}</div>
                        <h3 className="line-clamp-2 text-base font-semibold leading-5 tracking-[-0.025em] text-neutral-950">{candidate.title}</h3>
                        <p className="mt-2 truncate text-sm font-medium text-neutral-700">{candidate.name}</p>
                        <div className="mt-3 flex items-center justify-between gap-3">
                          <p className="truncate text-xs text-neutral-400">{candidate.city}</p>
                          <p className="text-lg font-semibold tracking-[-0.04em] text-neutral-950">{candidate.finalTotal.toFixed(2)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="scorecards" className="overflow-hidden rounded-[34px] border border-neutral-200/70 bg-white shadow-[0_24px_90px_rgba(0,0,0,0.06)]">
          <div className="border-b border-neutral-100 px-5 py-5 md:px-7">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-neutral-400">Score Entry</p>
                <h2 className="mt-2 text-4xl font-semibold tracking-[-0.06em] md:text-6xl">Judge Scorecards</h2>
              </div>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search candidate or province"
                className="w-full rounded-full border border-neutral-200 bg-neutral-50 px-5 py-3 text-sm font-semibold text-neutral-950 outline-none transition placeholder:text-neutral-400 focus:border-neutral-950 focus:bg-white md:max-w-sm"
              />
            </div>
          </div>

          <div className="grid gap-px bg-neutral-100 md:grid-cols-2 xl:grid-cols-3">
            {filteredCandidates.map((candidate) => {
              const score = scores[candidate.id] || {};
              const preliminaryTotal = getPreliminaryTotal(score);
              const rank = preliminaryRanking.findIndex((item) => item.id === candidate.id) + 1;
              const isTop15 = top15Ids.has(candidate.id);
              const currentTitle = finalSubmitted ? top7.find((item) => item.id === candidate.id)?.title : undefined;

              return (
                <article key={candidate.id} className="bg-white p-5">
                  <div className={`overflow-hidden rounded-[28px] border bg-white shadow-sm transition hover:shadow-[0_18px_60px_rgba(0,0,0,0.07)] ${isTop15 ? "border-neutral-950" : "border-neutral-200"}`}>
                    <div className="grid grid-cols-[108px_1fr]">
                      <div className="h-full min-h-[150px] overflow-hidden bg-neutral-100">
                        <CandidatePhoto candidate={candidate} className="h-full w-full" />
                      </div>

                      <div className="flex flex-col justify-between p-4">
                        <div>
                          <div className="flex items-start justify-between gap-3">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-400">#{candidate.id} · Prelim Rank {rank}</p>
                            <div className="rounded-2xl bg-neutral-950 px-3 py-2 text-right text-white">
                              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/45">Prelim</p>
                              <p className="text-xl font-semibold tracking-[-0.05em]">{preliminaryTotal.toFixed(2)}</p>
                            </div>
                          </div>
                          <h3 className="mt-3 text-xl font-semibold leading-6 tracking-[-0.04em]">{candidate.name}</h3>
                          <p className="mt-1 text-sm font-medium text-neutral-500">{candidate.city}</p>
                        </div>

                        {isTop15 && (
                          <div className="mt-4 rounded-2xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-xs font-semibold leading-4 text-neutral-600">
                            Top 15 Semifinalist
                          </div>
                        )}
                        {currentTitle && (
                          <div className="mt-2 rounded-2xl border border-neutral-200 bg-neutral-950 px-3 py-2 text-xs font-semibold leading-4 text-white">
                            {currentTitle}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="grid gap-3 border-t border-neutral-100 bg-neutral-50/70 p-4 sm:grid-cols-3">
                      {preliminaryCriteria.map((item) => (
                        <label key={item.key} className="block">
                          <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.16em] text-neutral-400">{item.label}</span>
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={score[item.key] ?? ""}
                            onChange={(event) => updateScore(candidate.id, item.key, event.target.value)}
                            placeholder="0"
                            className="h-12 w-full rounded-2xl border border-neutral-200 bg-white px-3 text-center text-lg font-semibold text-neutral-950 outline-none transition placeholder:text-neutral-300 focus:border-neutral-950"
                          />
                        </label>
                      ))}

                      <label className="block">
                        <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.16em] text-neutral-400">Q&A</span>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={score.qa ?? ""}
                          onChange={(event) => updateScore(candidate.id, "qa", event.target.value)}
                          placeholder={top15Submitted ? "0" : "Locked"}
                          disabled={!top15Submitted || !isTop15}
                          className="h-12 w-full rounded-2xl border border-neutral-200 bg-white px-3 text-center text-lg font-semibold text-neutral-950 outline-none transition placeholder:text-neutral-300 focus:border-neutral-950 disabled:cursor-not-allowed disabled:bg-neutral-100 disabled:text-neutral-300"
                        />
                      </label>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}
