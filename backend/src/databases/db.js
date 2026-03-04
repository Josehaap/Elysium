/**
 * Importaciones
 * *Important - Importaciones para generar pool y la configuración
 */
import mysql2 from 'mysql2/promise'; 
//ConfigDataPool objeto literal de configuración de pool. 
import configDataPool from './database.config.js';
//-----------------------------

//Configuramos la conexión. 
export const pool = mysql2.createPool(configDataPool); 


