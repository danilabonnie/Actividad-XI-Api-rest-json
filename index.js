const express = require ('express');
const fs = require ('fs');
const cors = require ('cors');
const app = express();
const port = 3000;


app.use(express.json()) 
app.use(express.static('./public'));//ejecutar directamente el front cuando corremos el servidor
app.use(cors());


const leerDatos = ()=>{
    try{
    const datos = fs.readFileSync('./public/data/datos.json')
    return JSON.parse(datos)
    }catch(error){
        console.log(error)
    }
}

const escribirDatos = (datos)=>{
    try{
    fs.writeFileSync('./public/data/datos.json',JSON.stringify(datos))

    }catch(error){
        console.log(error)
    }
}
function reIndexar(datos){
    let indice =1
    datos.productos.map((p)=>{
    p.id = indice;
    indice++;
})
}


app.get('/Productos', (req,res)=>{
    const datos=leerDatos()
    res.json(datos.productos)
})

app.post('/Productos', (req,res)=>{
    const datos=leerDatos()
    const nuevoProducto={id:datos.productos.length+1,
        ...req.body
    }
    datos.productos.push(nuevoProducto)
    escribirDatos(datos)
    res.json({mensaje:'Nuevo Producto Agregado'})
})

app.put('/Productos/:id', (req,res)=>{
    const id = req.params.id
    const nuevosDatos = req.body
    const datos=leerDatos()
    const prodEncontrado = datos.productos.find((p)=>p.id==req.params.id)

        if(!prodEncontrado){
          return res.status(404),res.json('No se encuentra el producto')
        }

        datos.productos = datos.productos.map(p=>p.id==req.params.id?{...p,...nuevosDatos}:p)
        escribirDatos(datos)
        res.json({mensaje: 'Productos actualizados', Productos: nuevosDatos})
})

app.delete('/Productos/:id', (req,res)=>{
    
    const id = req.params.id
    const datos=leerDatos()
    const prodEncontrado = datos.productos.find((p)=>p.id==req.params.id)

        if(!prodEncontrado){
          return res.status(404),res.json('No se encuentra el producto')
        }

        datos.productos = datos.productos.filter((p)=>p.id!=req.params.id)
        reIndexar(datos)
        escribirDatos(datos)
        res.json({mensaje:"Producto eliminado", Producto: prodEncontrado})
})

app.get('/Productos/:id', (req,res)=>{
    const datos=leerDatos()
    const prodEncontrado = datos.productos.find((p)=>p.id==req.params.id)

        if(!prodEncontrado){
          return res.status(404),res.json('No se encuentra el producto')
        }
        else{
         return res.json({
            mensaje: "Producto encontrado",
            Producto: prodEncontrado
        })
        }
})

app.listen(port, ()=>{
    console.log(`servidor corriendo en el puerto ${port}`)
}
)