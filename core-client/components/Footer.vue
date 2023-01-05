<template>

    <footer id="footer" class="py-5">

        <div class="container">

            <div class="row no-gutters">

                <div class="footer-item">
                    
                    <div class="mb-4">
    
                        <nuxt-img  
                            format="svg"
                            height="25"
                            src="svg/logo-tokopolis.svg"
                            alt="Logo Tokopolis"
                            loading="lazy"
                        />

                    </div>
                    
                    <div class="mb-4">

                        <p>
                            JL. TB Simatupang Banjarsari I No. 8C<br/>
                            Kec. Cilandak, Kota Adm. Jakarta Selatan<br/>
                            Provinsi DKI Jakarta, 12430
                        </p>

                    </div>

                    <div class="mb-4 mb-md-0">

                        <h4>Unduh</h4>
                        
                        <a href="#" class="d-inline-block mr-2">

                            <img
                                style="width: 90px; height: 30px"
                                src="/img/black_play_store.png"
                                alt="Get it on Google Play"
                                loading="lazy"
                            />

                        </a>

                        <a href="#" class="d-inline-block">

                            <img
                                style="width: 90px; height: 30px"
                                src="/img/black_app_store.png"
                                alt="Download on the App Store"
                                loading="lazy"
                            />

                        </a>

                    </div>
                    
                </div> <!-- col ends -->
                
                <div class="footer-item">

                    <div class="mb-4 mb-md-0">
                        
                        <h4>Tentang Tokopolis</h4>
                        
                        <ul class="list-unstyled">
                            
                            <li><a href="/tentang" class="text-reset">Tentang Kami</a></li>
                            
                            <li><a href="/layanan" class="text-reset">Layanan Kami</a></li>
                            
                            <li><a href="/kebijakan-privasi" class="text-reset">Kebijakan Privasi</a></li>
                            
                            <li><a href="/ketentuan-layanan" class="text-reset">Syarat dan Ketentuan</a></li> 
                            
                            <li><a href="/disclaimer" class="text-reset">Disclaimer</a></li>
                        
                        </ul>

                    </div>

                </div> <!-- col ends -->

                <div class="footer-item">

                    <div class="mb-4">
                        
                        <h4>Bekerja Sama Dengan</h4>
                        
                        <div>
                            <nuxt-img  
                                preset="default"
                                height="24"
                                src="img/brands/logo-istpro.png"
                                alt="Logo PT ISTPRO INTI NUSA"
                                loading="lazy"
                                class="d-inline"
                            />

                            <span>PT ISTPRO INTI NUSA</span>
                        </div>

                        <div>Izin No. KEP-157/KM.10/2007</div>

                    </div>

                    <div class="mb-4 mb-md-0">
                        
                        <h4>Terdaftar dan Diawasi oleh</h4>
                    
                            <nuxt-img  
                                format="svg"
                                height="24"
                                src="svg/brands/logo-ojk.svg"
                                alt="Logo Otoritas Jasa Keuangan"
                                loading="lazy"
                            />

                    </div>

                </div> <!-- col ends -->

                <div class="footer-item">

                    <div class="mb-4">

                        <h4>Hubungi Kami</h4>

                        <ul class="list-unstyled">
                            
                            <li class="d-flex">
                                
                                <div class="mr-2"><fa icon="envelope" width="16"/></div>
                                
                                <div>cs@tokopolis.id</div>
                            
                            </li>
                            
                            <li class="d-flex">
                                
                                <div class="mr-2"><fa :icon="['fab', 'whatsapp']"  width="16" /></div>
                                
                                <div>08111625999</div>

                            </li>

                        </ul>

                    </div>
                        
                    <div>
                        
                        <h4>Ikuti Kami</h4>
                        
                        <ul class="list-inline">
                            
                            <li class="list-inline-item mr-2">
                                
                                <a href="#" class="text-reset"><fa :icon="['fab', 'facebook']" class="social-icon"/></a>
                            
                            </li>

                            <li class="list-inline-item mr-2">
                                
                                <a href="#" class="text-reset"><fa :icon="['fab', 'instagram']" class="social-icon"/></a>
                            
                            </li>

                            <li class="list-inline-item mr-2">
                                
                                <a href="#" class="text-reset"><fa :icon="['fab', 'twitter']" class="social-icon"/></a>
                            
                            </li>

                            <li class="list-inline-item mr-2">
                                
                                <a href="#" class="text-reset"><fa :icon="['fab', 'linkedin']" class="social-icon"/></a>
                            
                            </li>

                        </ul>

                    </div>

                </div> <!-- col ends -->

            </div> <!-- row ends -->
            
        </div> <!-- container ends -->

    </footer>

</template>