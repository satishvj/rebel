import React, { useEffect, useState } from 'react'
import { Grid } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';

import Drawer from '@material-ui/core/Drawer';

const useStyles = makeStyles({
  root: {
    maxWidth: 345,
  },
  media: {
    height: 140,
    minWidth: 200,
  },
});

export default function BeerInfo(props) {
  const [data, setData] = useState(null)
  const classes = useStyles();
  const anchor = 'right'
  const [state, setState] = React.useState({
    left: true,
    right: true,
  });
  const [checked, setChecked] = React.useState(false);

  useEffect(() => {
    // const data = props.data;
    // const pageSize = props.pageSize;
    // const currentPage = props.currentPage;
    // const upperLimit = currentPage * pageSize;
    // const dataSlice = data.slice((upperLimit - pageSize), upperLimit);
    if (props && props.imgs) {
      setData(props.imgs)
    }
  }, [props])

  if (!data || data.length === 0) {
    return null
  }



  const toggleDrawer = (open) => (event) => {
    console.log(event)
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setChecked(!checked)
  };


  return (
    <div className='example' >

      <Card className={classes.root} onClick={toggleDrawer(checked)}>
        <CardActionArea>
          <CardMedia
            className={classes.media}
            image={data[props.count].image}
            title="Beers"
          />
          <CardContent>
            <Typography gutterBottom>
              {props.item.name}
            </Typography>
            <Typography variant="body2" color="textSecondary" component="p">
              {props.item.style}
            </Typography>

          </CardContent>
        </CardActionArea>

      </Card>
      <Drawer
        transitionDuration={{ enter: 500, exit: 1000 }}
        anchor='right' open={checked} className='right-drwr' onClose={toggleDrawer(checked)} >
        <div className='slideComp slideFront'>
          <div className='desc'>
            <Typography gutterBottom variant="h5" component="h2">
              Name: {props.item.name}
            </Typography>
            <Typography variant="body2" color="textSecondary" component="p">
            <b>Style:</b> {props.item.style}
            </Typography>
            {props.item && props.item.ounces && <Typography variant="body2" color="textSecondary" component="p"><b>abv:</b> {props.item.abv}</Typography>}

            {props.item && props.item.ounces && <Typography variant="body2" color="textSecondary" component="p"><b>ounces:</b>{props.item.ounces}</Typography>}

            {props.item && props.item.ibu && <Typography variant="body2" color="textSecondary" component="p"><b>Ibu:</b>{props.item.ibu}</Typography>}
          </div>
          <div>
            <img src={data[props.count].image} style={{ height: '250px' }} />
          </div>
        </div>
      </Drawer>

      <Drawer
        transitionDuration={{ enter: 500, exit: 1000 }}
        anchor='left' open={checked} className='left-drwr' onClose={toggleDrawer(checked)} >
        <div className='slideComp slideFront'>
          <img onClick={toggleDrawer(checked)} src="/backhome.svg" title='Back to Beers' className='onHoverPointer backImg' />
        </div>
      </Drawer>

    </div>
  );

}