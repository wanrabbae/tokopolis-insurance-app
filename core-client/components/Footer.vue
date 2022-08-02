<template>

    <footer id="footer">

        <div class="container">

            <div class="row">

                <div class="col-12 col-lg-3">
                    
                    <div class="mb-4">
    
                        <TokopolisLogo class="text-white" height="150px"/>

                    </div>
                    
                    <div class="mb-4">

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

                    <div class="mb-4">

                        <h4>Unduh</h4>
                        
                        <div class="download-image mr-2">
                            
                            <a href="#">
                                
                                <img 
                                    src="https://lh3.googleusercontent.com/cjsqrWQKJQp9RFO7-hJ9AfpKzbUb_Y84vXfjlP0iRHBvladwAfXih984olktDhPnFqyZ0nu9A5jvFwOEQPXzv7hr3ce3QVsLN8kQ2Ao=s0"
                                    alt="Get it on Google Play" 
                                >

                            </a>

                        </div>

                        <div class="download-image">

                            <a href="#">
                                
                                <img 
                                    src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
                                    alt="Download on the App Store" 
                                />

                            </a>

                        </div>
                    </div>
                    
                </div> <!-- col-12.col-lg-3 ends -->

                <div class="col-lg-3">

                    <div class="mb-4">

                        <h4>Alamat dan Kontak</h4>
                        
                        <ul class="list-unstyled">
                            
                            <li class="d-flex">
                                
                                <div class="mr-2">
                                    
                                    <fa icon="location-dot" width="16px" />
                                
                                </div>
                                
                                <div>Lorem ipsum dolor sit amet, constecteur asipit alit</div>
                            
                            </li>
                            
                            <li class="d-flex">
                                
                                <div class="mr-2">
                                    
                                    <fa icon="envelope" width="16px" />
                                
                                </div>
                                
                                <div>Hello@lorem.com</div>
                            
                            </li>
                            
                            <li class="d-flex">
                                
                                <div class="mr-2">
                                        
                                    <fa :icon="['fab', 'whatsapp']"  width="16px" />
                                
                                </div>
                                
                                <div>081234567890</div>
                            
                            </li>

                        </ul>
                        
                    </div>

                </div> <!-- col-12.col-lg-3 ends -->

                <div class="col-lg-3">

                    <div class="mb-4">
                        
                        <h4>Tentang PIQO</h4>
                        
                        <ul class="list-unstyled">
                            
                            <li><a href="#" class="text-reset">Apa itu Tokopolis?</a></li>
                            
                            <li><a href="/layanan" class="text-reset">Layanan Kami</a></li>
                            
                            <li><a href="#" class="text-reset">Kebijakan Privasi</a></li>
                            
                            <li><a href="#" class="text-reset">Syarat dan Ketentuan</a></li>
                            
                            <li><a href="/faq" class="text-reset">FAQ</a></li>
                        
                        </ul>

                    </div>

                </div> <!-- col-12.col-lg-3 ends -->

                <div class="col-lg-3">
                    
                    <div class="mb-4">
                        
                        <h4>Bekerja Sama Dengan</h4>
                        
                        <ul class="list-unstyled">
                            
                            <li>Lorem Ipsum</li>
                            
                            <li>Izin No. KEP-7767/MD/1986</li>
                        
                        </ul>

                    </div>

                    <div class="mb-4">
                        
                        <h4>Terdaftar dan Diawasi oleh</h4>
                        
                        <div style="width: 120px">

                            <b-img-lazy src="/svg/OJK.svg" alt="Logo OJK White" />
                        
                        </div>

                    </div>

                </div> <!-- col-12.col-lg-3 ends -->

            </div> <!-- row ends -->
            
            <div class="footer-separator"></div>
            
            <div class="copyright-text">&copy; Copyright 2021 - PiQO</div>
            
        </div> <!-- container ends -->

    </footer>

</template>

<script>
import TokopolisLogo from '../assets/svg/tokopolis-logo-white.svg'

export default {
    components: {
        TokopolisLogo
    }    
}
</script>