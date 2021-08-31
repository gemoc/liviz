package org.gemoc.liviz.render.views;


import org.eclipse.swt.widgets.Composite;
import org.eclipse.ui.part.*;
import org.eclipse.jface.viewers.*;
import org.eclipse.swt.graphics.Image;
import org.eclipse.jface.action.*;
import org.eclipse.jface.dialogs.MessageDialog;
import org.eclipse.ui.*;
import org.eclipse.swt.widgets.Menu;
import org.eclipse.swt.widgets.MessageBox;
import org.eclipse.swt.SWT;
import org.eclipse.swt.SWTError;
import org.eclipse.swt.browser.Browser;

import javax.inject.Inject;



public class RenderView extends ViewPart 
{

	private static final String URL = "http://localhost:3000/";
	/**
	 * The ID of the view as specified by the extension.
	 */
	public static final String ID = "org.gemoc.liviz.render.views.RenderView";

	@Inject IWorkbench workbench;
	
	Browser browser;
	
	

	@Override
	public void createPartControl(Composite parent)
	{
		try 
		{
	        browser = new Browser(parent, SWT.NONE);
	        browser.setUrl(URL);
		} 
		catch (SWTError e) 
		{
	         throw e;
	    }
	}


	@Override
	public void setFocus()
	{
		
	}
}
