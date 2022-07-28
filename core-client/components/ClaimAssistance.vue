<template>
    
    <component :is="tag">
        
        <h2 class="fs-lg-1 fs-3 text-center">{{ title }}</h2>
        
        <div class="row justify-content-center">
            
            <div v-for="(list, id) in claimAssistanceList" :key="id" class="col-12 col-lg-4">
                
                <a :href="list.link" class="card d-flex flex-row align-items-center p-3 mb-3">
                        
                    <div class="card-image">
                        
                        <b-img-lazy :src="list.image" :alt="list.text" />
                    
                    </div> <!-- card-image ends -->
                    
                    <div class="fs-lg-4 fs-5 fw-bold flex-grow-1 text-center text-dark">
                        
                        {{ list.text }}
                    
                    </div>
                
                </a> <!-- card ends -->
            
            </div> <!-- col-12.col-lg-4 ends -->
        
        </div> <!-- row ends -->
    
    </component>

</template>

<script>
export default {
    name: 'ClaimAssistance',
    props: {
        tag: {
            type: String,
            default: 'div',
            description: 'html tag'
        },
        title: {
            type: String,
            default: 'Claim Assistance'
        },
        claimAssistanceList: {
            type: Array,
            default: null
        }
    }
}
</script>