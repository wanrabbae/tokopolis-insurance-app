<template>
    
    <component :is="tag">
        
        <h2 class="fs-3 fs-lg-1 text-center">{{ title }}</h2>
        
        <div class="row">
            
            <div v-for="(list, id) in whyUsList" :key="id" class="col-6 col-lg-3">
                
                <div class="card">
                    
                    <div class="d-flex flex-column align-items-center">
                        
                        <div class="card-image d-flex align-items-center mb-3">
                            
                            <b-img-lazy :src="list.image" :alt="list.text + ' Icon'" />
                        
                        </div>
                        
                        <div class="fs-lg-4 text-center">{{ list.text }}</div>
                    
                    </div>
                
                </div>
            
            </div>
        
        </div>
    
    </component>

</template>

<script>
export default {
    name: 'WhyUs',
    props: {
        tag: {
            type: String,
            default: 'div',
            description: 'html tag'
        },
        title: {
            type: String,
            default: 'Kenapa Kami?'
        },
        whyUsList: {
        type: Array,
        default: null
        }
    }
}
</script>